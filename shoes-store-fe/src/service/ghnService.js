import axios from "axios";

const token = "d674b803-1838-11f0-b444-0a95609f9038";
const shopId = 5731436;

const ghn = axios.create({
  baseURL: "https://online-gateway.ghn.vn/shiip/public-api",
  headers: {
    "Content-Type": "application/json",
    Token: token,
    ShopId: shopId,
  },
});

export const getProvinces = async () => {
  const res = await ghn.get("/master-data/province");
  return res.data.data;
};

export const getDistricts = async (provinceId) => {
  const res = await ghn.post("/master-data/district", {
    province_id: provinceId,
  });
  return res.data.data;
};

export const getWards = async (districtId) => {
  const res = await ghn.post("/master-data/ward", { district_id: districtId });
  return res.data.data;
};

export const getServices = async (fromDistrict, toDistrict) => {
  const res = await ghn.post("/v2/shipping-order/available-services", {
    shop_id: shopId,
    from_district: fromDistrict,
    to_district: toDistrict,
  });
  return res.data.data;
};

export const previewShippingOrder = async ({
  serviceId,
  fromDistrict,
  toDistrict,
  wardCode,
  weight,
  height,
  length,
  width,
  toName,
  toPhone,
  toAddress,
  paymentMehod,
}) => {
  const payload = {
    payment_type_id: paymentMehod === "cod" ? 1 : 2, // hình thức thanh toán
    // 1: trả tiền khi nhận hàng (COD)
    to_name: toName,
    to_phone: toPhone,
    to_address: toAddress, // địa chỉ giao hàng
    to_ward_code: wardCode, // mã xã phường
    to_district_id: toDistrict, // mã quận huyện
    height,
    length,
    weight,
    width,
    insurance_value: 10000,
    service_id: serviceId,
    service_type_id: 2,
    from_district_id: fromDistrict,
    required_note: "KHONGCHOXEMHANG",
    content: "Giày", // thay ddoir
  };

  try {
    const res = await ghn.post("/v2/shipping-order/preview", payload);
    return res.data.data.total_fee;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy preview phí vận chuyển"
    );
  }
};
export const getLeadTime = async ({ toDistrict, wardCode, serviceId }) => {
  try {
    const res = await ghn.post("/v2/shipping-order/leadtime", {
      from_district_id: 1574,
      from_ward_code: "550303",
      to_district_id: toDistrict,
      to_ward_code: wardCode,
      service_id: serviceId,
    });
    return res.data.data.leadtime; // UNIX timestamp (giây)
  } catch (error) {
  
    throw new Error(
      error.response?.data?.message || "Không thể lấy thời gian giao hàng"
    );
  }
};
