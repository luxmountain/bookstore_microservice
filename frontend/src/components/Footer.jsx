import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold">BookStore</span>
            </div>
            <p className="text-gray-400 text-sm">
              Nhà sách trực tuyến hàng đầu Việt Nam với hàng nghìn đầu sách đa
              dạng, giá cả cạnh tranh và dịch vụ giao hàng nhanh chóng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/books"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tất cả sách
                </Link>
              </li>
              <li>
                <Link
                  to="/books?sort=newest"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sách mới
                </Link>
              </li>
              <li>
                <Link
                  to="/books?sort=bestseller"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Bán chạy
                </Link>
              </li>
              <li>
                <Link
                  to="/books?sort=discount"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <FiMapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội
                </span>
              </li>
              <li className="flex items-center text-gray-400">
                <FiPhone className="w-5 h-5 mr-2" />
                <span className="text-sm">1900 1234 56</span>
              </li>
              <li className="flex items-center text-gray-400">
                <FiMail className="w-5 h-5 mr-2" />
                <span className="text-sm">support@bookstore.vn</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
