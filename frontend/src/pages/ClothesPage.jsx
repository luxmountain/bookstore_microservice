import { useEffect, useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { clotheService } from "../services";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function ClothesPage() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchClothes = async () => {
      setLoading(true);
      try {
        const response = await clotheService.getAll({
          ordering: "-created_at",
        });
        setClothes(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching clothes:", error);
        setClothes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price || 0));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sản phẩm quần áo</h1>
          <p className="text-gray-500 mt-1">{clothes.length} sản phẩm</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary-600 text-white" : "bg-white text-gray-600"}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-600 text-white" : "bg-white text-gray-600"}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : clothes.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm quần áo"
          description="Dữ liệu từ clothe-service hiện đang trống hoặc chưa khả dụng"
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clothes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="w-full h-40 rounded-lg bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center mb-4">
                <span className="text-4xl">👕</span>
              </div>
              <h3 className="font-semibold text-gray-800 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
              <p className="text-primary-600 font-bold text-lg mt-3">
                {formatPrice(item.price)}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                Tồn kho: <span className="font-medium">{item.stock}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {clothes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Tồn kho: {item.stock}
                </p>
              </div>
              <p className="text-primary-600 font-bold text-lg whitespace-nowrap">
                {formatPrice(item.price)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
