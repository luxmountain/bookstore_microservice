import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPackage, FiEye } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { orderService, bookService } from "../services";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/orders" } } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await orderService.getAll(customer.id);
        const rawOrders = response.data.results || response.data || [];

        const bookIds = [
          ...new Set(
            rawOrders.flatMap((order) =>
              (order.items || []).map((item) => item.book_id),
            ),
          ),
        ];

        const bookPairs = await Promise.all(
          bookIds.map(async (bookId) => {
            try {
              const bookResponse = await bookService.getById(bookId);
              return [bookId, bookResponse.data];
            } catch {
              return [bookId, null];
            }
          }),
        );

        const bookMap = new Map(bookPairs);

        const ordersWithBooks = rawOrders.map((order) => ({
          ...order,
          items: (order.items || []).map((item) => ({
            ...item,
            book: bookMap.get(item.book_id) || null,
          })),
        }));

        setOrders(ordersWithBooks);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customer) {
      fetchOrders();
    }
  }, [customer, isAuthenticated, navigate]);

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

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={FiPackage}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào"
          action={
            <Link to="/books" className="btn-primary">
              Mua sắm ngay
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Đơn hàng của tôi
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-sm">Mã đơn hàng</p>
                <p className="font-semibold text-gray-800">#{order.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ngày đặt</p>
                <p className="text-gray-800">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tổng tiền</p>
                <p className="font-bold text-primary-600">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <Link
                to={`/orders/${order.id}`}
                className="btn-secondary flex items-center gap-2"
              >
                <FiEye className="w-4 h-4" /> Chi tiết
              </Link>
            </div>

            {/* Order Items Preview */}
            <div className="border-t pt-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {(order.items || []).slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden"
                  >
                    {item.book?.image_url ? (
                      <img
                        src={item.book.image_url}
                        alt={item.book?.title || `Sách #${item.book_id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">📚</span>
                      </div>
                    )}
                  </div>
                ))}
                {(order.items?.length || 0) > 4 && (
                  <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      +{order.items.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
