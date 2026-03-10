import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { orderService, bookService } from "../services";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await orderService.getById(id);
        const orderData = response.data;

        // Fetch book details for each item
        const itemsWithBooks = await Promise.all(
          (orderData.items || []).map(async (item) => {
            try {
              const bookRes = await bookService.getById(item.book_id);
              return { ...item, book: bookRes.data };
            } catch {
              return { ...item, book: null };
            }
          }),
        );

        setOrder({ ...orderData, items: itemsWithBooks });
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Không tìm thấy đơn hàng");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      paid: "Đã thanh toán",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    try {
      await orderService.cancel(id);
      setOrder((o) => ({ ...o, status: "cancelled" }));
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể hủy đơn hàng");
    }
  };

  const orderSteps = [
    { status: "pending", icon: FiPackage, label: "Đặt hàng" },
    { status: "confirmed", icon: FiCheck, label: "Xác nhận" },
    { status: "paid", icon: FiCheck, label: "Thanh toán" },
    { status: "shipped", icon: FiTruck, label: "Vận chuyển" },
    { status: "delivered", icon: FiCheck, label: "Hoàn thành" },
  ];

  const getCurrentStep = () => {
    const statusOrder = [
      "pending",
      "confirmed",
      "paid",
      "shipped",
      "delivered",
    ];
    return statusOrder.indexOf(order?.status) + 1;
  };

  if (loading) return <Loading />;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Đơn hàng #{order.id}
          </h1>
          <p className="text-gray-500">
            Đặt ngày {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`ml-auto px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}
        >
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Order Progress */}
      {order.status !== "cancelled" && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {orderSteps.map((step, index) => (
              <div key={step.status} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${index < getCurrentStep() ? "text-primary-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < getCurrentStep()
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 hidden sm:block">
                    {step.label}
                  </span>
                </div>
                {index < orderSteps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-1 mx-2 ${
                      index < getCurrentStep() - 1
                        ? "bg-primary-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">
              Sản phẩm
            </h2>

            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Link
                    to={`/books/${item.book_id}`}
                    className="w-20 h-28 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden"
                  >
                    {item.book?.image_url ? (
                      <img
                        src={item.book.image_url}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <span className="text-3xl">📚</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex-grow">
                    <Link
                      to={`/books/${item.book_id}`}
                      className="font-medium text-gray-800 hover:text-primary-600"
                    >
                      {item.book?.title || `Sách #${item.book_id}`}
                    </Link>
                    <p className="text-gray-500 text-sm">{item.book?.author}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-gray-600">
                        Số lượng: {item.quantity}
                      </span>
                      <span className="font-medium text-primary-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">
              Thông tin đơn hàng
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Địa chỉ giao hàng</p>
                <p className="text-gray-800">
                  {order.shipping_address || "Không có"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phương thức vận chuyển</p>
                <p className="text-gray-800">
                  {order.shipping_method === "express"
                    ? "Giao hàng nhanh"
                    : "Giao hàng tiêu chuẩn"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phương thức thanh toán</p>
                <p className="text-gray-800">
                  {order.payment_method === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Chuyển khoản ngân hàng"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">
              Tổng tiền
            </h2>

            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Tổng cộng</span>
              <span className="text-primary-600">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          {order.status === "pending" && (
            <button
              onClick={handleCancelOrder}
              className="btn-danger w-full flex items-center justify-center gap-2"
            >
              <FiX className="w-5 h-5" /> Hủy đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
