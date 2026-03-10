import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";
import { bookService, catalogService } from "../services";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const catalogId = searchParams.get("catalog");
  const searchQuery = searchParams.get("search");
  const sortBy = searchParams.get("sort") || "newest";

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await catalogService.getAll();
        setCatalogs(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {};
        if (catalogId) params.catalog_id = catalogId;
        if (searchQuery) params.search = searchQuery;
        if (sortBy === "newest") params.ordering = "-created_at";
        if (sortBy === "price_low") params.ordering = "price";
        if (sortBy === "price_high") params.ordering = "-price";

        const response = await bookService.getAll(params);
        setBooks(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [catalogId, searchQuery, sortBy]);

  const handleCatalogChange = (id) => {
    if (id) {
      searchParams.set("catalog", id);
    } else {
      searchParams.delete("catalog");
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (sort) => {
    searchParams.set("sort", sort);
    setSearchParams(searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : "Tất cả sách"}
          </h1>
          <p className="text-gray-500 mt-1">{books.length} sản phẩm</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_low">Giá thấp - cao</option>
            <option value="price_high">Giá cao - thấp</option>
          </select>

          {/* View Mode */}
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

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2 border rounded-lg"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"} md:block`}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCatalogChange(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !catalogId
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Tất cả
                </button>
              </li>
              {catalogs.map((catalog) => (
                <li key={catalog.id}>
                  <button
                    onClick={() => handleCatalogChange(catalog.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      catalogId == catalog.id
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {catalog.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Books Grid */}
        <div className="flex-grow">
          {loading ? (
            <Loading />
          ) : books.length === 0 ? (
            <EmptyState
              title="Không tìm thấy sách"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <BookListItem key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookListItem({ book }) {
  const { addItem } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
      <div className="w-32 h-40 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg">{book.title}</h3>
        <p className="text-gray-500">{book.author}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {book.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(book.price)}
          </span>
          <button
            onClick={() => addItem(book.id)}
            disabled={book.stock === 0}
            className="btn-primary"
          >
            {book.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useCart } from "../context/CartContext";
