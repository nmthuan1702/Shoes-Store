import React, { useState } from "react";

export default function Product() {
  const [products] = useState([
    {
      id: "SP001",
      name: "Điện thoại iPhone 14 Pro Max",
      image: "/api/placeholder/80/80",
      category: "Điện thoại",
      price: "29.990.000₫",
      stock: 24,
      status: "Còn hàng",
      rating: 4.9,
      featured: true,
    },
    {
      id: "SP002",
      name: "Laptop MacBook Air M2",
      image: "/api/placeholder/80/80",
      category: "Laptop",
      price: "26.990.000₫",
      stock: 15,
      status: "Còn hàng",
      rating: 4.8,
      featured: true,
    },
    {
      id: "SP003",
      name: "Tai nghe Apple AirPods Pro",
      image: "/api/placeholder/80/80",
      category: "Phụ kiện",
      price: "5.990.000₫",
      stock: 32,
      status: "Còn hàng",
      rating: 4.7,
      featured: false,
    },
    {
      id: "SP004",
      name: "Samsung Galaxy S23 Ultra",
      image: "/api/placeholder/80/80",
      category: "Điện thoại",
      price: "24.990.000₫",
      stock: 17,
      status: "Còn hàng",
      rating: 4.8,
      featured: true,
    },
    {
      id: "SP005",
      name: "iPad Pro M2 11 inch",
      image: "/api/placeholder/80/80",
      category: "Máy tính bảng",
      price: "19.990.000₫",
      stock: 9,
      status: "Còn hàng",
      rating: 4.9,
      featured: true,
    },
    {
      id: "SP006",
      name: "Đồng hồ Apple Watch Series 8",
      image: "/api/placeholder/80/80",
      category: "Đồng hồ thông minh",
      price: "10.990.000₫",
      stock: 0,
      status: "Hết hàng",
      rating: 4.6,
      featured: false,
    },
    {
      id: "SP007",
      name: "Loa Bluetooth Sony SRS-XB33",
      image: "/api/placeholder/80/80",
      category: "Âm thanh",
      price: "3.290.000₫",
      stock: 21,
      status: "Còn hàng",
      rating: 4.5,
      featured: false,
    },
    {
      id: "SP008",
      name: "Máy ảnh Sony Alpha A7 IV",
      image: "/api/placeholder/80/80",
      category: "Máy ảnh",
      price: "51.990.000₫",
      stock: 5,
      status: "Sắp hết hàng",
      rating: 4.9,
      featured: true,
    },
  ]);

  // SVG icons as inline components
  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const MoreIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500"
    >
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="19" cy="12" r="1"></circle>
      <circle cx="5" cy="12" r="1"></circle>
    </svg>
  );

  const ChevronLeft = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRight = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const StarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-400"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Còn hàng":
        return "bg-green-100 text-green-800";
      case "Hết hàng":
        return "bg-red-100 text-red-800";
      case "Sắp hết hàng":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case "Điện thoại":
        return "bg-blue-100 text-blue-800";
      case "Laptop":
        return "bg-purple-100 text-purple-800";
      case "Phụ kiện":
        return "bg-orange-100 text-orange-800";
      case "Máy tính bảng":
        return "bg-green-100 text-green-800";
      case "Đồng hồ thông minh":
        return "bg-pink-100 text-pink-800";
      case "Âm thanh":
        return "bg-indigo-100 text-indigo-800";
      case "Máy ảnh":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm mb-2">
          <a href="#" className="text-blue-500">
            Trang chủ
          </a>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-800">Quản lý sản phẩm</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm sản phẩm
          </button>
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors cursor-pointer">
            Tất cả sản phẩm (42)
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            Còn hàng (36)
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            Sắp hết hàng (5)
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            Hết hàng (1)
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            Sản phẩm nổi bật (5)
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã SP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <a
                      href="#"
                      className="text-blue-600 font-medium hover:text-blue-800"
                    >
                      {product.id}
                    </a>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md mr-3 object-cover"
                      />
                      <div>
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {product.name}
                        </a>
                        {product.featured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryClass(
                        product.category
                      )}`}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {product.price}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {product.stock} sản phẩm
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon />
                      <span className="ml-1 text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-700">
            <span>Hiển thị 1-8 trên tổng số 42 sản phẩm</span>
            <button className="ml-2 text-blue-600 font-medium hover:text-blue-800">
              Xem tất cả
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronLeft />
            </button>
            <button className="h-8 w-8 rounded-md border border-gray-300 bg-blue-600 text-white flex items-center justify-center">
              1
            </button>
            <button className="h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors">
              2
            </button>
            <button className="h-8 w-8 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors">
              3
            </button>
            <button className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
