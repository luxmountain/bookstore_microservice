import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { customer, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              BookStore
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-primary-600"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/books"
              className="text-gray-600 hover:text-primary-600 font-medium"
            >
              Sách
            </Link>

            <Link
              to="/clothes"
              className="text-gray-600 hover:text-primary-600 font-medium"
            >
              Quần áo
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600"
            >
              <FiShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600">
                  <FiUser className="w-6 h-6" />
                  <span className="font-medium">
                    {customer?.first_name || "User"}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="w-4 h-4 mr-2" /> Tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FiPackage className="w-4 h-4 mr-2" /> Đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="w-4 h-4 mr-2" /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/books"
              className="block text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sách
            </Link>
            <Link
              to="/clothes"
              className="block text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Quần áo
            </Link>
            <Link
              to="/cart"
              className="flex items-center text-gray-600 hover:text-primary-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiShoppingCart className="w-5 h-5 mr-2" />
              Giỏ hàng ({itemCount})
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-600 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-600 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-red-600 font-medium"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
