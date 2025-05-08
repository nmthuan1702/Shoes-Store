import React, { useEffect, useState } from "react";
import productApi from "../../../api/user/productApi";
import categoryApi from "../../../api/user/categoryApi";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import SortDropdown from "./SortDropdown";
import { useParams } from "react-router-dom";

const ProductGrid = () => {
  const { categoryId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState("Ngày (từ mới đến cũ)");
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const getSortParams = (option) => {
    switch (option) {
      case "Giá (từ thấp đến cao)":
        return { sortBy: "price", direction: "asc" };
      case "Giá (từ cao đến thấp)":
        return { sortBy: "price", direction: "desc" };
      case "Tên (A-Z)":
        return { sortBy: "name", direction: "asc" };
      case "Tên (Z-A)":
        return { sortBy: "name", direction: "desc" };
      default:
        return { sortBy: "id", direction: "asc" };
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { sortBy, direction } = getSortParams(sortOption);
        let result;
        if (categoryId) {
          result = await productApi.getByCategory(
            categoryId,
            currentPage,
            10,
            sortBy,
            direction
          );
        } else {
          result = await productApi.getAll(currentPage, 10, sortBy, direction);
        }
        if (result && result.status === 200) {
          setProducts(result.data || []);
          setTotalPages(Math.ceil(result.totalCount / 10) || 1);
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
  }, [categoryId, currentPage, sortOption]);

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(0);
  };
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categoryId) {
        const result = await categoryApi.getById(categoryId);
        console.log(result);

        setCategoryName(result.data.name);
      }
    };

    fetchCategoryName();
  }, [categoryId]);
  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {categoryId ? `${categoryName}` : "Tất cả sản phẩm"}
        </h2>
        <SortDropdown
          onSortChange={handleSortChange}
          selectedOption={sortOption}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Không có sản phẩm...</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
