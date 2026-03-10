import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function BookCard({ book }) {
  const { addItem } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(book.id);
  };

  return (
    <div className="card overflow-hidden group">
      <Link to={`/books/${book.id}`}>
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {book.image_url ? (
            <img
              src={book.image_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-6xl text-primary-400">📚</span>
            </div>
          )}

          {book.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px] group-hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
            {book.author}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(book.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
