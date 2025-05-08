import React, { useState, useEffect } from "react";
import ProductCard from "../../../components/user/ProductCard";
import productApi from "../../../api/user/productApi";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);

  const slides = [
    "https://pendecor.vn/uploads/files/2024/08/04/mo-cua-hang-giay-dep-1.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await productApi.getAll(
          currentPage,
          10,
          sortBy,
          direction
        );
        if (result && result.status === 200) {
          setProducts(result.data || []);
          setTotalPages(
            Math.ceil((result.totalCount || result.data.length) / 10)
          );
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, direction]);

  return (
    <div className="font-sans">
      {/* Banner Slider */}
      <div className="relative w-full h-100 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${slides.length * 100}%`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full flex items-center justify-center"
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">HÀNG NỔI BẬT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </>
          )}
        </div>
      </div>
      {/* Footer */}
    </div>
  );
};

export default HomePage;
