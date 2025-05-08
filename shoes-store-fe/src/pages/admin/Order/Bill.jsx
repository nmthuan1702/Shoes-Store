import React from 'react';

const Bill = () => {
  const invoice = {
    orderId: 'HD001',
    createdAt: '25/04/2025 14:30',
    username: 'Nguyễn Văn A',
    items: [
      { productName: 'Cà phê sữa', quantity: 2, price: 25000 },
      { productName: 'Bánh mì', quantity: 1, price: 30000 },
    ],
  };

  const totalPrice = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border border-gray-300 rounded shadow text-sm font-mono print:shadow-none print:border-0">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">☕ QUÁN CÀ PHÊ FSHARK</h1>
        <p>Địa chỉ: 123 Trà Sữa, Q.1, TP.HCM</p>
        <p>Điện thoại: 0909 999 999</p>
      </div>

      <hr className="my-2" />

      <div className="mb-2">
        <p>Mã hoá đơn: {invoice.orderId}</p>
        <p>Khách hàng: {invoice.username}</p>
        <p>Thời gian: {invoice.createdAt}</p>
      </div>

      <hr className="my-2" />

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="pb-1">Món</th>
            <th className="pb-1 text-right">SL</th>
            <th className="pb-1 text-right">Giá</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.productName}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">
                {(item.price * item.quantity).toLocaleString()}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="my-2" />

      <div className="flex justify-between font-bold">
        <span>Tổng cộng</span>
        <span>{totalPrice.toLocaleString()}đ</span>
      </div>

      <div className="text-center mt-4 text-xs italic">
        <p>Cảm ơn quý khách!</p>
        <p>Hẹn gặp lại ♥</p>
      </div>

      <div className="text-center mt-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          In hóa đơn
        </button>
      </div>
    </div>
  );
};

export default Bill;
