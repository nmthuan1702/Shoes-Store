import { useState, useEffect } from "react";
import AddressModal from "./Modal";
import addressApi from "../../../api/user/addressApi";
import Loading from "../../../components/Loading";
import Cookies from "js-cookie";
import { useCart } from "../../../context/CartContext";
import orderApi from "../../../api/user/orderApi";
import axios from "axios";
import {
  getProvinces,
  getDistricts,
  getWards,
  getServices,
  previewShippingOrder,
  getLeadTime,
} from "../../../service/ghnService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const username = Cookies.get("username");
  const { cartItems, fetchCartData, formatTotalAmount, totalItems, clearCart } =
    useCart();

  const [leadTime, setLeadTime] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchUserAddresses();
    fetchCartData();
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const total = cartItems.reduce(
        (sum, item) =>
          sum + (parseFloat(item.totalPrice.replace(/[^\d]/g, "")) || 0),
        0
      );
      setTotalAmount(total);
    }
  }, [cartItems]);

  const fetchProvinces = async () => {
    try {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    } catch (error) {}
  };

  const fetchUserAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressApi.getAddressByUsername(username);
      if (data.error) {
        return;
      }
      if (Array.isArray(data) && data.length > 0) {
        setAddresses(data);
        setSelectedAddressId(data[0].id);
        setToName(data[0].recipientName);
        setToPhone(data[0].phone);
        setToAddress(data[0].address);

        if (data[0].province && data[0].district && data[0].ward) {
          const province = provinces.find(
            (p) => p.ProvinceName === data[0].province
          );
          if (province) {
            setSelectedProvince(province.ProvinceID);

            const districtsData = await getDistricts(province.ProvinceID);
            setDistricts(districtsData);

            const district = districtsData.find(
              (d) => d.DistrictName === data[0].district
            );
            if (district) {
              setSelectedDistrict(district.DistrictID);

              const wardsData = await getWards(district.DistrictID);
              setWards(wardsData);

              const ward = wardsData.find((w) => w.WardName === data[0].ward);
              if (ward) {
                setSelectedWard(ward.WardCode);
              }
            }
          }
        }
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setShowAddressModal(true);
  };

  const handleOpenEditModal = () => {
    setModalMode("edit");
    setShowAddressModal(true);
  };

  const handleOpenListModal = () => {
    setModalMode("list");
    setShowAddressModal(true);
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
  };

  const handleAddressUpdate = async (data) => {
    if (data.type === "select") {
      setSelectedAddressId(data.selectedId);
      const newSelectedAddress = addresses.find(
        (a) => a.id === data.selectedId
      );

      if (newSelectedAddress) {
        setToName(newSelectedAddress.recipientName);
        setToPhone(newSelectedAddress.phone);
        setToAddress(newSelectedAddress.address);

        const province = provinces.find(
          (p) => p.ProvinceName === newSelectedAddress.province
        );
        if (province) {
          setSelectedProvince(province.ProvinceID);
          getDistricts(province.ProvinceID).then((districtsData) => {
            setDistricts(districtsData);

            const district = districtsData.find(
              (d) => d.DistrictName === newSelectedAddress.district
            );
            if (district) {
              setSelectedDistrict(district.DistrictID);
              getWards(district.DistrictID).then((wardsData) => {
                setWards(wardsData);

                const ward = wardsData.find(
                  (w) => w.WardName === newSelectedAddress.ward
                );
                if (ward) {
                  setSelectedWard(ward.WardCode);
                }
              });
            }
          });
        }
      }
    } else {
      await fetchUserAddresses();
      if (data.selectedId !== undefined) {
        setSelectedAddressId(data.selectedId);
      }
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const formatCurrency = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  ////////////////////////////////////////////////////////////////
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const fromDistrict = 1574;
  const weight = 50 * totalQuantity;
  const length = 20;
  const width = 20;
  const height = 10;

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleCalculate = async () => {
    if (!selectedAddress) {
      return;
    }

    if (cartItems.length === 0) {
      setShippingFee(0);
      return;
    }

    setIsCalculatingFee(true);
    try {
      const services = await getServices(
        fromDistrict,
        selectedAddress.district_id
      );
      if (!services || services.length === 0) {
        setIsCalculatingFee(false);
        return;
      }
      const serviceId = services[0].service_id;
      const payload = {
        serviceId: serviceId,
        fromDistrict,
        toDistrict: selectedAddress.district_id,
        wardCode: selectedAddress.ward_code,
        weight,
        height,
        length,
        width,
        toName: selectedAddress.recipientName,
        toPhone: selectedAddress.phone,
        toAddress: selectedAddress.address,
        paymentMethod: paymentMethod,
      };

      const calculatedFee = await previewShippingOrder(payload);
      setShippingFee(calculatedFee);

      //  tính thời gian vận chuyển
      const leadTimestamp = await getLeadTime({
        toDistrict: selectedAddress.district_id,
        wardCode: selectedAddress.ward_code,
        serviceId: serviceId,
      });

      const deliveryDate = new Date(leadTimestamp * 1000);
      setLeadTime(deliveryDate);
    } catch (err) {
      setShippingFee(0);
    } finally {
      setIsCalculatingFee(false);
    }
  };

  useEffect(() => {
    if (selectedAddress && cartItems) {
      setToName(selectedAddress.recipientName);
      setToPhone(selectedAddress.phone);
      setToAddress(selectedAddress.address);
      setSelectedDistrict(selectedAddress.district_id);
      setSelectedWard(selectedAddress.ward_code);
      handleCalculate();
    }
  }, [selectedAddress, cartItems]);

  /////////////////////////////////////////////////////////////////

  const renderAddressSection = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (addresses.length === 0) {
      return (
        <div className="">
          <p className="text-gray-500 mb-4">
            Bạn chưa có địa chỉ giao hàng nào.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleOpenAddModal}
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      );
    }

    return (
      <div className="mb-6">
        {selectedAddress && (
          <div className="border border-blue-500 rounded-lg p-4 mb-3 cursor-pointer relative">
            <div className="flex items-start">
              <input
                type="radio"
                checked={true}
                className="mr-3 mt-1"
                readOnly
              />
              <div className="flex-grow">
                <div className="flex gap-2 items-center mb-1">
                  <span className="font-medium">
                    {selectedAddress.recipientName}
                  </span>
                  <span className="text-gray-600">
                    ({selectedAddress.phone})
                  </span>
                </div>
                <p className="text-base text-gray-600">
                  Địa chỉ: {selectedAddress.address}
                </p>
                <p className="text-base text-gray-600">
                  {selectedAddress.country}, {selectedAddress.province},{" "}
                  {selectedAddress.city}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="text-blue-600 text-base font-medium cursor-pointer"
                  onClick={handleOpenEditModal}
                >
                  Chỉnh sửa
                </button>
                <button
                  className="text-blue-600 text-base font-medium cursor-pointer"
                  onClick={handleOpenListModal}
                >
                  Thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // In CheckoutPage.jsx
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsProcessingPayment(true);
    try {
      if (paymentMethod === "VNPay") {
        const orderData = {
          username: username,
          shippingAddressId: selectedAddressId,
          paymentMethod: paymentMethod,
          shippingFee: shippingFee,
          shippingTime: leadTime?.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
        const createdOrder = await orderApi.createOrder(orderData);
        const response = await axios.post("http://localhost:8080/api/payment", {
          amount: totalAmount + shippingFee,
          orderInfo: `Thanh toán đơn hàng #${createdOrder.id} của ${username}`,
          orderId: createdOrder.id,
        });

        if (response.data) {
          window.location.href = response.data;
        } else {
          throw new Error("Không thể tạo liên kết thanh toán");
        }
      } else if (paymentMethod === "cod") {
        const orderData = {
          username: username,
          shippingAddressId: selectedAddressId,
          paymentMethod: "Thanh toán khi nhận hàng",
          shippingFee: shippingFee,
          shippingTime: leadTime?.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
        const createdOrder = await orderApi.createOrder(orderData);
        toast.success("Bạn đã đặt hàng thành công!");
        await clearCart();
        navigate("/success", {
          state: {
            orderId: createdOrder.id,
            orderData: orderData,
            paymentMethod: "Thanh toán khi nhận hàng",
          },
        });
      }
    } catch (error) {
    
      toast.error("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.");
    } finally {
      setIsProcessingPayment(false);
    }
  };
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Giao hàng</h2>
                {addresses.length > 0 && (
                  <button
                    className="text-blue-600 text-base font-medium cursor-pointer"
                    onClick={handleOpenAddModal}
                  >
                    + Thêm địa chỉ mới
                  </button>
                )}
              </div>
              {renderAddressSection()}

              {/* Shipping Method */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">
                  Phương thức vận chuyển
                </h2>

                <div className="border border-gray-300 rounded mb-4">
                  <div className="flex items-center p-4">
                    <input
                      type="radio"
                      id="shipping-standard"
                      name="shipping"
                      className="mr-3"
                      defaultChecked
                    />
                    <label htmlFor="shipping-standard" className="flex-grow">
                      <span className="block">
                        Kiện hàng của bạn được giao bởi giao hàng nhanh (GHN)
                      </span>
                    </label>
                    <div className="flex justify-between">
                      <span className="me-2">Phí vận chuyển:</span>
                      <span className="font-medium">
                        {isCalculatingFee
                          ? "Đang tính..."
                          : `${formatCurrency(shippingFee)} VND`}
                      </span>
                    </div>
                  </div>
                </div>
                <p>
                  Dự kiến giao hàng vào:{" "}
                  {leadTime?.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">
                  Phương thức thanh toán
                </h2>

                <div className="border border-gray-300 rounded mb-4">
                  {/* VNPay */}
                  {/* <div className="flex items-start p-4 border-b border-gray-200">
                    <input
                      type="radio"
                      id="payment-VNPay"
                      name="payment"
                      className="mt-3 mr-3 cursor-pointer"
                      checked={paymentMethod === "VNPay"}
                      onChange={() => setPaymentMethod("VNPay")}
                    />
                    <label htmlFor="payment-VNPay" className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="cursor-pointer">
                          Thanh toán online qua cổng thanh toán VNPay
                        </span>
                        <div className="flex space-x-2 ">
                          <img
                            src="https://img.icons8.com/color/32/mastercard-logo.png"
                            alt="MasterCard"
                          />
                          <img
                            src="https://img.icons8.com/color/32/jcb.png"
                            alt="JCB"
                          />
                          <img
                            src="https://img.icons8.com/color/32/visa.png"
                            alt="VISA"
                          />
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                            alt="VNPay"
                            className="w-8 h-8"
                          />
                        </div>
                      </div>

                      {paymentMethod === "VNPay" && (
                        <div className="mt-4 text-base text-gray-600 flex items-center space-x-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M4 6h16M4 12h16m-7 6h7"
                            />
                          </svg>
                          <p>
                            Sau khi nhấp vào "Thanh toán ngay", bạn sẽ được
                            chuyển hướng đến Thanh toán online qua cổng thanh
                            toán VNPay để hoàn tất việc mua hàng một cách an
                            toàn.
                          </p>
                        </div>
                      )}
                    </label>
                  </div> */}

                  {/* COD */}
                  <div className="flex items-center p-4">
                    <input
                      type="radio"
                      id="payment-cod"
                      name="payment"
                      className="mr-3 cursor-pointer"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <label htmlFor="payment-cod" className="flex-grow">
                      <span className="block cursor-pointer">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full bg-black text-white py-3 rounded font-medium mb-4 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={handleCheckout}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán ngay"}
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded shadow-sm sticky top-4">
              {/* Order Items */}
              <div className="mb-6">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-start mb-4">
                      <div className="w-15 h-20 bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          Size: {item.size}, Màu: {item.color}, Số lượng:{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">
                          Giá tiền:{" "}
                          <span className="text-sm">{item.formattedPrice}</span>
                        </p>{" "}
                        <p className="font-medium">
                          Tổng tiền:{" "}
                          <span className="text-sm">{item.totalPrice}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Không có sản phẩm nào trong giỏ hàng
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-base">
                    Tổng phụ - {totalItems} mặt hàng
                  </span>
                  <span className="font-medium">{formatTotalAmount}</span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-base">Phí vận chuyển</span>
                  <span className="font-medium">
                    {isCalculatingFee
                      ? "Đang tính..."
                      : `${formatCurrency(shippingFee)} VND`}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Tổng cộng</span>
                    <div className="text-right">
                      <span className="font-medium text-lg ml-1">
                        {formatCurrency(shippingFee + totalAmount)} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddressModal
          show={showAddressModal}
          onClose={handleCloseModal}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onAddressUpdate={handleAddressUpdate}
          modalMode={modalMode}
          username={username}
        />
      </div>
    </div>
  );
}
