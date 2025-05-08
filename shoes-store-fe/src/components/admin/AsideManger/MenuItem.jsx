import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ icon, text, to, onClick, textColor = "text-gray-700" }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center px-3 py-2 ${textColor} hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-all`}
    >
      <span className="mr-3 text-indigo-500">{icon}</span>
      {text}
    </Link>
  );
};

export default MenuItem;
