import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCreditCard, FiTruck, FiCheck } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { customer, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shipping_address: customer?.address || "",
    shipping_method: "standard",
    payment_method: "cod",
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const shippingMethods = [
    {
      id: "standard",
      name: "Giao hàng tiêu chuẩn",
      desc: "3-5 ngày làm việc",
      price: 0,
    },
    {
      id: "express",
      name: "Giao hàng nhanh",
      desc: "1-2 ngày làm việc",
      price: 30000,
    },
  ];

  const paymentMethods = [
    { id: "cod", name: "Thanh toán khi nhận hàng", icon: FiTruck },
    { id: "bank", name: "Chuyển khoản ngân hàng", icon: FiCreditCard },
  ];

  const selectedShipping = shippingMethods.find(
    (m) => m.id === formData.shipping_method,
  );
  const totalAmount = cart.total + (selectedShipping?.price || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.shipping_address.trim()) {
        toast.error("Vui lòng nhập địa chỉ giao hàng");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3: Place order
    setLoading(true);
    try {
      const orderData = {
        customer_id: customer.id,
        shipping_address: formData.shipping_address,
        shipping_method: formData.shipping_method,
        payment_method: formData.payment_method,
      };

      const response = await orderService.create(orderData);
      await clearCart();
      toast.success("Đặt hàng thành công!");
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          title="Vui lòng đăng nhập"
          description="Đăng nhập để tiến hành thanh toán"
          action={
            <Link to="/login" className="btn-primary">
              Đăng nhập
            </Link>
          }
        />
      </div>
    );
  }

  if (cartLoading) return <Loading />;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          title="Giỏ hàng trống"
          description="Không có sản phẩm để thanh toán"
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>

      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {["Địa chỉ", "Thanh toán", "Xác nhận"].map((label, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step > index + 1
                  ? "bg-green-500 text-white"
                  : step === index + 1
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > index + 1 ? <FiCheck /> : index + 1}
            </div>
            <span
              className={`ml-2 hidden sm:block ${step === index + 1 ? "text-primary-600 font-medium" : "text-gray-500"}`}
            >
              {label}
            </span>
            {index < 2 && (
              <div
                className={`w-16 sm:w-24 h-1 mx-4 ${step > index + 1 ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 text-lg mb-4">
                  Thông tin giao hàng
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      value={`${customer?.first_name} ${customer?.last_name}`}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customer?.email}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={customer?.phone}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    value={formData.shipping_address}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        shipping_address: e.target.value,
                      }))
                    }
                    rows={3}
                    className="input-field"
                    placeholder="Nhập địa chỉ giao hàng chi tiết..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phương thức vận chuyển
                  </label>
                  <div className="space-y-2">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.shipping_method === method.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={formData.shipping_method === method.id}
                            onChange={(e) =>
                              setFormData((d) => ({
                                ...d,
                                shipping_method: e.target.value,
                              }))
                            }
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {method.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {method.desc}
                            </p>
                          </div>
                        </div>
                        <span
                          className={
                            method.price === 0
                              ? "text-green-600"
                              : "font-medium"
                          }
                        >
                          {method.price === 0
                            ? "Miễn phí"
                            : formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-800 text-lg mb-4">
                  Phương thức thanh toán
                </h2>

                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.payment_method === method.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={formData.payment_method === method.id}
                        onChange={(e) =>
                          setFormData((d) => ({
                            ...d,
                            payment_method: e.target.value,
                          }))
                        }
                        className="mr-3"
                      />
                      <method.icon className="w-6 h-6 text-gray-600 mr-3" />
                      <span className="font-medium text-gray-800">
                        {method.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-semibold text-gray-800 text-lg">
                  Xác nhận đơn hàng
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Địa chỉ giao hàng
                    </h3>
                    <p className="text-gray-600">{formData.shipping_address}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Phương thức vận chuyển
                    </h3>
                    <p className="text-gray-600">{selectedShipping?.name}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Phương thức thanh toán
                    </h3>
                    <p className="text-gray-600">
                      {
                        paymentMethods.find(
                          (m) => m.id === formData.payment_method,
                        )?.name
                      }
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-2">Sản phẩm</h3>
                    {cart.items.map((item) => (
                      <div
                        key={item.book_id}
                        className="flex justify-between py-2"
                      >
                        <span className="text-gray-600">
                          {item.book?.title} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {item.book &&
                            formatPrice(item.book.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-secondary"
                >
                  Quay lại
                </button>
              ) : (
                <Link to="/cart" className="btn-secondary">
                  Quay lại giỏ hàng
                </Link>
              )}

              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? "Đang xử lý..."
                  : step === 3
                    ? "Đặt hàng"
                    : "Tiếp tục"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="font-semibold text-gray-800 text-lg mb-4">
              Đơn hàng
            </h2>

            <div className="space-y-3 border-b pb-4 mb-4 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.book_id} className="flex gap-3">
                  <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0">
                    {item.book?.image_url ? (
                      <img
                        src={item.book.image_url}
                        alt=""
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.book?.title}
                    </p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {item.book && formatPrice(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span
                  className={
                    selectedShipping?.price === 0 ? "text-green-600" : ""
                  }
                >
                  {selectedShipping?.price === 0
                    ? "Miễn phí"
                    : formatPrice(selectedShipping?.price || 0)}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Tổng cộng</span>
              <span className="text-primary-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
