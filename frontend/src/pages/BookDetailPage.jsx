import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiStar,
} from "react-icons/fi";
import { bookService, catalogService, commentService } from "../services";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

export default function BookDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated, customer } = useAuth();

  const [book, setBook] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [newComment, setNewComment] = useState({ rating: 5, content: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookRes = await bookService.getById(id);
        setBook(bookRes.data);

        if (bookRes.data.catalog_id) {
          try {
            const catalogRes = await catalogService.getById(
              bookRes.data.catalog_id,
            );
            setCatalog(catalogRes.data);
          } catch {}
        }

        try {
          const commentsRes = await commentService.getByBook(id);
          setComments(
            commentsRes.data.reviews ||
              commentsRes.data.results ||
              commentsRes.data ||
              [],
          );
        } catch {}
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async () => {
    const success = await addItem(book.id, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      await commentService.create({
        book_id: parseInt(id),
        customer_id: customer.id,
        rating: newComment.rating,
        content: newComment.content,
      });

      // Refresh comments
      const commentsRes = await commentService.getByBook(id);
      setComments(
        commentsRes.data.reviews ||
          commentsRes.data.results ||
          commentsRes.data ||
          [],
      );
      setNewComment({ rating: 5, content: "" });
      toast.success("Đã thêm bình luận");
    } catch (error) {
      toast.error("Không thể thêm bình luận");
    }
  };

  if (loading) return <Loading />;
  if (!book)
    return (
      <div className="container mx-auto px-4 py-8">Không tìm thấy sách</div>
    );

  const avgRating =
    comments.length > 0
      ? (
          comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
        ).toFixed(1)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link to="/books" className="hover:text-primary-600">
          Sách
        </Link>
        {catalog && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/books?catalog=${catalog.id}`}
              className="hover:text-primary-600"
            >
              {catalog.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-800">{book.title}</span>
      </nav>

      {/* Product Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                <span className="text-9xl">📚</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {book.title}
            </h1>
            <p className="text-gray-500 text-lg mb-4">Tác giả: {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-5 h-5 ${star <= avgRating ? "fill-current" : ""}`}
                  />
                ))}
              </div>
              <span className="text-gray-500">
                ({comments.length} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary-600">
                {formatPrice(book.price)}
              </span>
            </div>

            {/* Stock */}
            <div className="mb-6">
              {book.stock > 0 ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Còn {book.stock} sản phẩm
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  Hết hàng
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(book.stock, q + 1))
                  }
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="btn-primary flex items-center gap-2 flex-grow md:flex-grow-0"
              >
                <FiShoppingCart className="w-5 h-5" />
                {book.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
              <button className="btn-secondary p-3">
                <FiHeart className="w-5 h-5" />
              </button>
              <button className="btn-secondary p-3">
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>

            {/* Meta */}
            <div className="border-t pt-6 space-y-2 text-sm text-gray-500">
              <p>
                <span className="font-medium text-gray-700">ISBN:</span>{" "}
                {book.isbn}
              </p>
              {catalog && (
                <p>
                  <span className="font-medium text-gray-700">Danh mục:</span>{" "}
                  {catalog.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "description"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Mô tả
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "reviews"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Đánh giá ({comments.length})
          </button>
        </div>

        <div className="bg-white rounded-b-xl p-6 shadow-sm">
          {activeTab === "description" ? (
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-line">
                {book.description || "Chưa có mô tả cho sản phẩm này."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Comment Form */}
              {isAuthenticated && (
                <form onSubmit={handleSubmitComment} className="border-b pb-6">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Viết đánh giá của bạn
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Đánh giá
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewComment((c) => ({ ...c, rating: star }))
                          }
                          className="text-2xl"
                        >
                          <FiStar
                            className={`w-8 h-8 ${
                              star <= newComment.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Nội dung
                    </label>
                    <textarea
                      value={newComment.content}
                      onChange={(e) =>
                        setNewComment((c) => ({
                          ...c,
                          content: e.target.value,
                        }))
                      }
                      rows={4}
                      className="input-field"
                      placeholder="Chia sẻ cảm nhận của bạn về sách..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Gửi đánh giá
                  </button>
                </form>
              )}

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Chưa có đánh giá nào
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b pb-6 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {comment.customer_name?.[0] || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.customer_name || "Khách hàng"}
                        </p>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`w-4 h-4 ${star <= comment.rating ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
