import { act, useState } from "react";
import avt from "./avt";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const ProfileMenu = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("username");

    setProfileOpen(false);
    navigate("/login");
  };
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
        onClick={() => setProfileOpen(!isProfileOpen)}
      >
        <img
          src={avt.s}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
        />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          {/* Menu Items */}
          <div className="mt-1 space-y-1">
            <button
              onClick={handleLogout}
              className=" cursor-pointer flex items-center gap-2 w-full text-left py-2 px-3 text-sm text-red-500 hover:bg-red-50  hover:text-red-600 rounded-md mt-1"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
