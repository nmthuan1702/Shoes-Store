import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import categoryApi from "../../../api/user/categoryApi";

export default function Navbar({ categoryId }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const location = useLocation();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryApi.getAll();
        if (
          result?.status === 200 &&
          Array.isArray(result?.data) &&
          result.data.length > 0
        ) {
          setCategories(result.data || []);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (categoryId) {
        try {
          const result = await categoryApi.getById(categoryId);
          if (result?.status === 200 && result?.data?.name) {
            setCategoryName(result.data.name);
          } else {
            setCategoryName("Danh mục không xác định");
          }
        } catch (error) {
        
          setCategoryName("Danh mục không xác định");
        }
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  const menuItems = [
    { title: "TRANG CHỦ", link: "/index", subMenu: [] },
    {
      title: "SẢN PHẨM",
      link: "/product",
      subMenu: categories,
    },
    { title: "TÀI KHOẢN CỦA BẠN", link: "/profile", subMenu: [] },
  ];

  return (
    <nav className="relative shadow-md">
      <ul className="flex justify-center space-x-8 py-4 uppercase font-semibold text-gray-800">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="relative cursor-pointer group"
            onMouseEnter={() =>
              item.subMenu.length > 0 && setOpenDropdown(index)
            }
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link
              to={item.link}
              className={`relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 group-hover:after:w-full ${
                location.pathname === item.link ||
                (item.link === "/product" &&
                  location.pathname.startsWith("/product"))
                  ? "after:w-full"
                  : ""
              }`}
            >
              {item.title}
            </Link>
            {Array.isArray(item.subMenu) && item.subMenu.length > 0 && (
              <div
                className={`absolute left-0 top-12 w-64 bg-white shadow-lg border border-gray-200 p-4 rounded-lg transform transition-all duration-300 ease-out delay-100 ${
                  openDropdown === index
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <ul>
                  {item.subMenu.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className="py-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition-all duration-200"
                    >
                      <Link to={`/product/category/${sub.id}`}>{sub.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      {categoryId && categoryName && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold">{categoryName}</h2>
        </div>
      )}
    </nav>
  );
}
