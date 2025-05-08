const OrderHistoryTab = ({ active, title, count, onClick }) => {
  return (
    <div 
      className={`px-4 py-2 text-center flex-1 relative overflow-hidden group cursor-pointer ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      {!active && (
        <div className="absolute inset-0 bg-blue-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
      )}
      <span className="relative z-10">
        {title}
        {count > 0 && <span className="ml-1">({count})</span>}
      </span>
    </div>
  );
};

export default OrderHistoryTab;