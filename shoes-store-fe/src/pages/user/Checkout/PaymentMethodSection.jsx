
import React from "react";

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-1">Thanh toán</h2>
      <p className="text-base text-gray-500 mb-4">
        Toàn bộ các giao dịch được bảo mật và mã hóa.
      </p>
      {/* Payment Method - COD (Cash) */}
      <div className="mb-2 border border-gray-300 rounded p-3">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            className="h-4 w-4"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <label htmlFor="cod" className="text-base">
            Thanh toán bằng tiền mặt khi nhận hàng (COD)
          </label>
        </div>
      </div>
      {/* Payment Method - VNPay */}
      <div className="mb-2 border border-gray-300 rounded p-3">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="vnpay"
            name="paymentMethod"
            className="h-4 w-4"
            checked={paymentMethod === "vnpay"}
            onChange={() => setPaymentMethod("vnpay")}
          />
          <label
            htmlFor="vnpay"
            className="text-base flex items-center justify-between w-full"
          >
            <span>VNPay - Thẻ ATM/Internet Banking/QR Code</span>
            <div className="flex gap-2">
              <div className="h-6 w-10 bg-white rounded border border-gray-300 flex items-center justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                  alt="VNPay"
                  className="h-4"
                />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Description for Online Payment */}
      {(paymentMethod === "onepay" || paymentMethod === "vnpay") && (
        <div className="bg-gray-100 p-4 mb-4 text-center">
          <div className="w-24 h-12 mx-auto mb-2 border border-gray-300 bg-white flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <p className="text-xs">
            Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được chuyển hướng đến
            {paymentMethod === "onepay" ? " OnePAY" : " VNPay"} để hoàn tất việc
            mua hàng một cách an toàn.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSection;