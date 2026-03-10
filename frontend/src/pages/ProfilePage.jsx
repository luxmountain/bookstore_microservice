import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { customerService } from "../services";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, updateCustomer } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await customerService.getProfile(customer.id);
        const data = response.data;
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customer) {
      fetchProfile();
    }
  }, [customer, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await customerService.updateProfile(
        customer.id,
        formData,
      );
      updateCustomer(response.data);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      const errors = error.response?.data;
      if (typeof errors === "object") {
        Object.values(errors).forEach((err) => {
          toast.error(Array.isArray(err) ? err[0] : err);
        });
      } else {
        toast.error("Không thể cập nhật thông tin");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Thông tin tài khoản
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-primary-600 font-bold">
                {formData.first_name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.first_name} {formData.last_name}
              </h2>
              <p className="text-gray-500">@{customer?.username}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiUser className="inline w-4 h-4 mr-1" /> Họ
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, first_name: e.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, last_name: e.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiMail className="inline w-4 h-4 mr-1" /> Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, email: e.target.value }))
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiPhone className="inline w-4 h-4 mr-1" /> Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, phone: e.target.value }))
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiMapPin className="inline w-4 h-4 mr-1" /> Địa chỉ
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, address: e.target.value }))
                }
                rows={3}
                className="input-field"
                placeholder="Nhập địa chỉ của bạn..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <FiSave className="w-5 h-5" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
