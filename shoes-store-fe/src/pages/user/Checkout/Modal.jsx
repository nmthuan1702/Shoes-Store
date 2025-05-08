import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getProvinces,
  getDistricts,
  getWards,
} from "../../../service/ghnService";
import addressApi from "../../../api/user/addressApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
export default function AddressModal({
  show,
  onClose,
  addresses: initialAddresses,
  selectedAddressId: initialSelectedId,
  onAddressUpdate,
  modalMode: initialModalMode = "add",
  username = "test",
}) {
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [selectedAddressId, setSelectedAddressId] = useState(
    initialSelectedId || 0
  );
  const [modalMode, setModalMode] = useState(initialModalMode);
  const [isLoading, setIsLoading] = useState(false);
  const user = Cookies.get("username") || username;
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      provinceId: "",
      districtId: "",
      wardCode: "",
      isDefault: false,
    },
  });

  const watchProvinceId = watch("provinceId");
  const watchDistrictId = watch("districtId");

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (watchProvinceId && watchProvinceId !== "") {
      fetchDistricts(parseInt(watchProvinceId));
      // Clear district and ward when province changes
      setValue("districtId", "");
      setValue("wardCode", "");
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [watchProvinceId, setValue]);

  useEffect(() => {
    if (watchDistrictId && watchDistrictId !== "") {
      fetchWards(parseInt(watchDistrictId));
      setValue("wardCode", "");
    } else {
      setWards([]);
    }
  }, [watchDistrictId, setValue]);

  useEffect(() => {
    if (initialAddresses) setAddresses(initialAddresses);
  }, [initialAddresses]);

  useEffect(() => {
    if (initialSelectedId) setSelectedAddressId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    setModalMode(initialModalMode);
    if (initialModalMode === "edit") {
      loadAddressForEditing();
    } else if (initialModalMode === "add") {
      resetFormFields();
    }
  }, [initialModalMode, initialSelectedId, addresses]);

  const fetchProvinces = async () => {
    try {
      setLoadingLocations(true);
      const data = await getProvinces();
      setProvinces(data || []);
    } catch (error) {
      // toast.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      setLoadingLocations(true);
      const data = await getDistricts(provinceId);
      setDistricts(data || []);
    } catch (error) {
      // toast.error("Không thể tải danh sách quận/huyện");
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      setLoadingLocations(true);
      const data = await getWards(districtId);
      setWards(data || []);
    } catch (error) {
      // toast.error("Không thể tải danh sách phường/xã");
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadAddressForEditing = () => {
    const addressToEdit = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (addressToEdit) {
      reset({
        name: addressToEdit.name || addressToEdit.recipientName || "",
        phone: addressToEdit.phone || "",
        address: addressToEdit.address || "",
        provinceId:
          addressToEdit.province_id?.toString() ||
          addressToEdit.provinceId?.toString() ||
          "",
        districtId:
          addressToEdit.district_id?.toString() ||
          addressToEdit.districtId?.toString() ||
          "",
        wardCode: addressToEdit.ward_code || addressToEdit.wardCode || "",
        isDefault: addressToEdit.isDefault || false,
      });
      if (addressToEdit.province_id || addressToEdit.provinceId) {
        fetchDistricts(addressToEdit.province_id || addressToEdit.provinceId);

        if (addressToEdit.district_id || addressToEdit.districtId) {
          fetchWards(addressToEdit.district_id || addressToEdit.districtId);
        }
      }
    }
  };

  const resetFormFields = () => {
    reset({
      name: "",
      phone: "",
      address: "",
      provinceId: "",
      districtId: "",
      wardCode: "",
      isDefault: false,
    });

    setDistricts([]);
    setWards([]);
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const selectedProvince = provinces.find(
        (p) => p.ProvinceID === parseInt(formData.provinceId)
      );
      const selectedDistrict = districts.find(
        (d) => d.DistrictID === parseInt(formData.districtId)
      );
      const selectedWard = wards.find((w) => w.WardCode === formData.wardCode);

      const addressData = {
        user: user,
        recipientName: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: selectedProvince ? selectedProvince.ProvinceName : "",
        province: selectedDistrict ? selectedDistrict.DistrictName : "",
        country: selectedWard ? selectedWard.WardName : "",
        province_id: parseInt(formData.provinceId),
        district_id: parseInt(formData.districtId),
        ward_code: formData.wardCode,
        isDefault: formData.isDefault,
      };

      let updatedAddresses = [];
      let updatedId;

      if (modalMode === "add") {
        const response = await addressApi.addAddressByUsername(addressData);
        if (!response.data) {
          toast.error(response.message);
          return;
        }
        toast.success(response.message);
        updatedId = response.data.id;
        updatedAddresses = [...addresses, response];
      } else if (modalMode === "edit") {
        const response = await addressApi.updateAddressById(
          selectedAddressId,
          addressData
        );
        if (!response.data || response.error) {
          toast.error(response.message);
          return;
        }
        toast.success(response.message);
        updatedId = selectedAddressId;
        updatedAddresses = addresses.map((addr) =>
          addr.id === selectedAddressId
            ? { ...addr, ...addressData, id: addr.id }
            : addr
        );
      }

      setAddresses(updatedAddresses);
      setSelectedAddressId(updatedId);

      if (onAddressUpdate) {
        onAddressUpdate({
          type: modalMode,
          addresses: updatedAddresses,
          selectedId: updatedId,
        });
      }

      onClose();
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDelete = (id) => {
    setAddressToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteAddress(addressToDelete);
    setShowConfirmModal(false);
  };

  const handleDeleteAddress = async (shippingAddressId) => {
    try {
      setIsLoading(true);
      const response = await addressApi.removeAddressById(shippingAddressId);

      if (!response || response.error) {
        toast.error(response?.error || "Không thể xóa địa chỉ");
        return;
      }
      toast.success("Xóa địa chỉ thành công");
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== shippingAddressId
      );
      setAddresses(updatedAddresses);
      if (updatedAddresses.length === 0) {
        setSelectedAddressId(null);
        if (onAddressUpdate) {
          onAddressUpdate({
            type: "delete",
            addresses: [],
            selectedId: null,
          });
        }
      } else if (selectedAddressId === shippingAddressId) {
        setSelectedAddressId(updatedAddresses[0].id);
        if (onAddressUpdate) {
          onAddressUpdate({
            type: "delete",
            addresses: updatedAddresses,
            selectedId: updatedAddresses[0].id,
          });
        }
      } else {
        if (onAddressUpdate) {
          onAddressUpdate({
            type: "delete",
            addresses: updatedAddresses,
            selectedId: selectedAddressId,
          });
        }
      }

      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa địa chỉ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    if (onAddressUpdate) {
      onAddressUpdate({ type: "select", selectedId: addressId });
    }
    onClose();
  };

  const handleOpenAddMode = () => {
    setModalMode("add");
    resetFormFields();
  };

  const handleOpenEditMode = (addressId) => {
    setSelectedAddressId(addressId);
    setModalMode("edit");
    const addressToEdit = addresses.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      reset({
        name: addressToEdit.name || addressToEdit.recipientName || "",
        phone: addressToEdit.phone || "",
        address: addressToEdit.address || "",
        provinceId:
          addressToEdit.province_id?.toString() ||
          addressToEdit.provinceId?.toString() ||
          "",
        districtId:
          addressToEdit.district_id?.toString() ||
          addressToEdit.districtId?.toString() ||
          "",
        wardCode: addressToEdit.ward_code || addressToEdit.wardCode || "",
        isDefault: addressToEdit.isDefault || false,
      });

      if (addressToEdit.province_id || addressToEdit.provinceId) {
        fetchDistricts(addressToEdit.province_id || addressToEdit.provinceId);
      }
      if (addressToEdit.district_id || addressToEdit.districtId) {
        fetchWards(addressToEdit.district_id || addressToEdit.districtId);
      }
    }
  };

  if (!show) return null;

  const renderModalContent = () => {
    switch (modalMode) {
      case "list":
        return (
          <>
            <h2 className="text-lg font-medium mb-4">Chọn địa chỉ giao hàng</h2>
            {addresses.length === 0 ? (
              <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAddressId === address.id
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleSelectAddress(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={selectedAddressId === address.id}
                          onChange={() => handleSelectAddress(address.id)}
                          className="mr-3 mt-1"
                        />
                        <div>
                          <div className="flex gap-2 items-center mb-1">
                            <span className="font-medium">
                              {address.name || address.recipientName}
                            </span>
                            <span className="text-gray-600">
                              ({address.phone})
                            </span>
                          </div>
                          <p className="text-base text-gray-600">
                            {address.address}
                          </p>
                          <p className="text-base text-gray-600">
                            {address.wardName || address.country},{" "}
                            {address.districtName || address.province},{" "}
                            {address.provinceName || address.city}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditMode(address.id);
                          }}
                          className="px-4 py-2 border border-blue-400 text-blue-400 rounded cursor-pointer me-3"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="px-4 py-2 border border-red-500 text-red-500 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(address.id);
                          }}
                          disabled={isLoading}
                        >
                          Xóa địa chỉ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <ConfirmDeleteModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={handleConfirmDelete}
            />
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleOpenAddMode}
                className="text-blue-600 text-base font-medium"
              >
                + Thêm địa chỉ mới
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleSelectAddress(selectedAddressId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={!selectedAddressId || addresses.length === 0}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </>
        );

      case "add":
      case "edit":
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-lg font-medium mb-4">
              {modalMode === "add" ? "Thêm địa chỉ mới" : "Chỉnh sửa địa chỉ"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2`}
                  placeholder="Nguyễn Văn A"
                  disabled={isLoading}
                  {...register("name", {
                    required: "Họ và tên không được để trống",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-medium mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className={`w-full border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2`}
                  placeholder="0987654321"
                  disabled={isLoading}
                  {...register("phone", {
                    required: "Số điện thoại không được để trống",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-medium mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full border ${
                      errors.provinceId ? "border-red-500" : "border-gray-300"
                    } rounded px-3 py-2`}
                    disabled={loadingLocations || isLoading}
                    {...register("provinceId", {
                      required: "Vui lòng chọn Tỉnh/Thành phố",
                    })}
                  >
                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                    {provinces.map((province) => (
                      <option
                        key={province.ProvinceID}
                        value={province.ProvinceID}
                      >
                        {province.ProvinceName}
                      </option>
                    ))}
                  </select>
                  {errors.provinceId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.provinceId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full border ${
                      errors.districtId ? "border-red-500" : "border-gray-300"
                    } rounded px-3 py-2`}
                    disabled={!watchProvinceId || loadingLocations || isLoading}
                    {...register("districtId", {
                      required: "Vui lòng chọn Quận/Huyện",
                    })}
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {districts.map((district) => (
                      <option
                        key={district.DistrictID}
                        value={district.DistrictID}
                      >
                        {district.DistrictName}
                      </option>
                    ))}
                  </select>
                  {errors.districtId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.districtId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium mb-1">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full border ${
                      errors.wardCode ? "border-red-500" : "border-gray-300"
                    } rounded px-3 py-2`}
                    disabled={!watchDistrictId || loadingLocations || isLoading}
                    {...register("wardCode", {
                      required: "Vui lòng chọn Phường/Xã",
                    })}
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {wards.map((ward) => (
                      <option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </option>
                    ))}
                  </select>
                  {errors.wardCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.wardCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-base font-medium mb-1">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded px-3 py-2`}
                  placeholder="Số nhà, tên đường"
                  disabled={isLoading}
                  {...register("address", {
                    required: "Địa chỉ cụ thể không được để trống",
                  })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <div
                  className={`flex gap-2 ${
                    modalMode === "add" ? "ml-auto" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Đang lưu..."
                      : modalMode === "add"
                      ? "Lưu địa chỉ"
                      : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000021] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">
            {modalMode === "add"
              ? "Thêm địa chỉ mới"
              : modalMode === "edit"
              ? "Chỉnh sửa địa chỉ"
              : "Danh sách địa chỉ"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{renderModalContent()}</div>
      </div>
    </div>
  );
}
