import React from "react";
import ProfileMenu from "../ProfileMenu";

const HeaderManager = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm px-6 h-16 flex justify-between items-center w-full border-b border-gray-100">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="text-gray-600 sm:hidden focus:outline-none"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2">
          <span className="text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-64 text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default HeaderManager;
