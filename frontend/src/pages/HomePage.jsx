import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiCreditCard,
} from "react-icons/fi";
import { bookService, catalogService } from "../services";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

export default function HomePage() {
  const [newBooks, setNewBooks] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catalogsRes] = await Promise.all([
          bookService.getAll({ limit: 8 }),
          catalogService.getAll(),
        ]);
        setNewBooks(booksRes.data.results || booksRes.data || []);
        setCatalogs(catalogsRes.data.results || catalogsRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      icon: FiTruck,
      title: "Miễn phí vận chuyển",
      desc: "Cho đơn hàng từ 300K",
    },
    {
      icon: FiShield,
      title: "Đảm bảo chất lượng",
      desc: "Sách chính hãng 100%",
    },
    { icon: FiHeadphones, title: "Hỗ trợ 24/7", desc: "Tư vấn nhiệt tình" },
    {
      icon: FiCreditCard,
      title: "Thanh toán an toàn",
      desc: "Bảo mật thông tin",
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khám phá thế giới sách
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              Hàng nghìn đầu sách hay đang chờ bạn. Mua sách online dễ dàng,
              giao hàng nhanh chóng trên toàn quốc.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Mua sách ngay
              </Link>
              <Link
                to="/books?sort=bestseller"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Sách bán chạy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Danh mục sách</h2>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Xem tất cả <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {catalogs.slice(0, 6).map((catalog) => (
                <Link
                  key={catalog.id}
                  to={`/books?catalog=${catalog.id}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="font-medium text-gray-800">{catalog.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Books */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Sách mới nhất</h2>
            <Link
              to="/books?sort=newest"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              Xem tất cả <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newBooks.slice(0, 8).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Đăng ký nhận tin khuyến mãi
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Nhận thông tin về sách mới và ưu đãi hấp dẫn trực tiếp vào email của
            bạn
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
