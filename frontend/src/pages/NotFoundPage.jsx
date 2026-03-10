import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          Trang không tồn tại
        </h2>
        <p className="text-gray-500 mt-2 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome className="w-5 h-5" /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
