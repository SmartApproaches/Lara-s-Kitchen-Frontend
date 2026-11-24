import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, message, Modal, Select } from "antd";
import { DeleteOutlined, EnvironmentOutlined, CheckCircleFilled } from "@ant-design/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Cancel01Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import { useCreateOrderMutation } from "../../../../../../../redux/slices/cashier/ordersApiSlice";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { countryCodes } from "../countryCode";
import SuccessModal from "../sucessModal";
import toast from "react-hot-toast";
const libraries = ["places"];
const GOOGLE_MAPS_API_KEY = "AIzaSyAdj9yCjRwmShW7rJbvHlEcyfMsztXw_iE";

const OrderPanel = ({ drawerOpen, cartItemsArray, subTotal, setCart, setIsDrawerOpen }) => {
  const [collapseInfo, setCollapseInfo] = useState(true);
  const [orderType, setOrderType] = useState("Dine-In");
  const [autocomplete, setAutocomplete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    guest_name: "",
    country_code: "+44",
    guest_phone: "",
    guest_email: "",
    table_number: "",
    guest_address: "",
    guest_latitude: "",
    guest_longitude: "",
    note: "",
  });

  const [createOrder, { isLoading, isSuccess, isError, error, data: createOrderData }] =
    useCreateOrderMutation();

  const tabs = [
    { key: "Dine-In", label: "Dine-In", apiValue: "dine_in" },
    { key: "Pickup", label: "Pickup", apiValue: "pickup" },
    { key: "Delivery", label: "Delivery", apiValue: "delivery" },
  ];

  useEffect(() => {
    if (isSuccess && createOrderData) {
      setOrderData(createOrderData.data);
      setIsSuccessModalOpen(true);
      setCart({}); // Clear cart after successful order
      setIsDrawerOpen(false); // Close drawer

      // Reset form
      setFormData({
        guest_name: "",
        country_code: "+44",
        guest_phone: "",
        guest_email: "",
        table_number: "",
        guest_address: "",
        guest_latitude: "",
        guest_longitude: "",
        note: "",
      });
    }
  }, [isSuccess, createOrderData, setCart, setIsDrawerOpen]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.data?.message || error?.data?.error || "Failed to create order";

      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  }, [isError, error]);

  const handleClearCart = () => {
    setCart({});
    setIsDrawerOpen(false);
  };

  const handleDeleteItem = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[item.id];
      return newCart;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setFormData((prev) => ({
          ...prev,
          guest_address: place.formatted_address || "",
          guest_latitude: lat.toString(),
          guest_longitude: lng.toString(),
        }));

        message.success("Address selected successfully!");
      }
    }
  };

  // const handlePlaceOrder = async () => {
  //   // Validation
  //   if (cartItemsArray.length === 0) {
  //     message.warning("Cart is empty!");
  //     return;
  //   }

  //   if (!formData.guest_name.trim()) {
  //     message.warning("Please enter guest name");
  //     return;
  //   }

  //   if (!formData.guest_phone.trim()) {
  //     message.warning("Please enter phone number");
  //     return;
  //   }

  //   const currentOrderType = tabs.find((tab) => tab.key === orderType)?.apiValue || "dine_in";

  //   // Validation for delivery
  //   if (currentOrderType === "delivery") {
  //     if (!formData.guest_address.trim()) {
  //       message.warning("Please enter delivery address");
  //       return;
  //     }
  //     if (!formData.guest_latitude || !formData.guest_longitude) {
  //       message.warning("Please select a valid address from the dropdown");
  //       return;
  //     }
  //   }

  //   // Combine country code with phone number
  //   const fullPhoneNumber = `${formData.country_code}${formData.guest_phone}`;

  //   // Prepare order payload
  //   const orderPayload = {
  //     order_type: currentOrderType,
  //     items: cartItemsArray.map(({ item, qty, size }) => ({
  //       menu_item_id: item.id,
  //       quantity: qty,
  //       size: size,
  //     })),
  //     guest_name: formData.guest_name,
  //     guest_phone: fullPhoneNumber,
  //     guest_email: formData.guest_email || undefined,
  //     note: formData.note || undefined,
  //   };

  //   // Add conditional fields based on order type
  //   if (currentOrderType === "dine_in") {
  //     orderPayload.table_number = formData.table_number;
  //   }

  //   if (currentOrderType === "delivery") {
  //     orderPayload.guest_address = formData.guest_address;
  //     orderPayload.guest_latitude = formData.guest_latitude;
  //     orderPayload.guest_longitude = formData.guest_longitude;
  //   }

  //   try {
  //     await createOrder(orderPayload).unwrap();
  //   } catch (err) {
  //     const errMsg = err?.data?.message || err?.data?.error || "Order creation failed";

  //     toast.error(errMsg);
  //     console.error("Failed to create order:", err);
  //   }
  // };
  const handlePlaceOrder = async () => {
    // Basic validation
    if (cartItemsArray.length === 0) {
      message.warning("Cart is empty!");
      return;
    }

    if (!formData.guest_name?.trim()) {
      message.warning("Please enter guest name");
      return;
    }

    if (!formData.guest_phone?.trim()) {
      message.warning("Please enter phone number");
      return;
    }

    const currentOrderType = tabs.find((tab) => tab.key === orderType)?.apiValue || "dine_in";

    // Delivery-specific validation
    if (currentOrderType === "delivery") {
      if (!formData.guest_address?.trim()) {
        message.warning("Please enter delivery address");
        return;
      }

      if (formData.guest_latitude === undefined || formData.guest_longitude === undefined) {
        message.warning("Please select a valid address from the dropdown");
        return;
      }
    }

    // Combine country code + phone
    const fullPhoneNumber = `${formData.country_code}${formData.guest_phone}`;

    // Base payload
    const orderPayload = {
      order_type: currentOrderType,
      items: cartItemsArray.map(({ item, qty, size }) => ({
        menu_item_id: item.id,
        quantity: qty,
        size,
      })),
      guest_name: formData.guest_name,
      guest_phone: fullPhoneNumber,
      guest_email: formData.guest_email || undefined,
      note: formData.note || undefined,
    };

    // Dine-in fields
    if (currentOrderType === "dine_in") {
      orderPayload.table_number = formData.table_number;
    }

    // Delivery fields (PARSE FLOAT HERE ✅)
    if (currentOrderType === "delivery") {
      const latitude = parseFloat(formData.guest_latitude);
      const longitude = parseFloat(formData.guest_longitude);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        message.warning("Invalid location coordinates");
        return;
      }

      orderPayload.guest_address = formData.guest_address;
      orderPayload.guest_latitude = latitude; // number ✅
      orderPayload.guest_longitude = longitude; // number ✅
    }

    try {
      await createOrder(orderPayload).unwrap();
    } catch (err) {
      const errMsg = err?.data?.message || err?.data?.error || "Order creation failed";

      toast.error(errMsg);
      console.error("Failed to create order:", err);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setOrderData(null);
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <Drawer
        placement="right"
        open={drawerOpen}
        width={420}
        mask={false}
        destroyOnClose={false}
        closable={false}
        bodyStyle={{
          background: "#FFFFFF",
          padding: 0,
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            {/* <p className="text-lg font-semibold text-[#0A3A1A]">N2345678</p>
            <p className="text-sm text-gray-500">Michael Nile</p> */}
          </div>

          <div className="flex items-center gap-2">
            <Button icon={<DeleteOutlined />} danger type="text" onClick={handleClearCart} />
            <button className="text-2xl text-[#0A3A1A] hover:opacity-60" onClick={handleClearCart}>
              <HugeiconsIcon icon={Cancel01Icon} />
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setCollapseInfo(!collapseInfo)}
          >
            <span className="font-semibold text-[#0A3A1A]">Customer Information</span>
            <HugeiconsIcon icon={ArrowUp01Icon} className={`${collapseInfo ? "rotate-180" : ""}`} />
          </button>

          {collapseInfo && (
            <div className="mt-3 space-y-3">
              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Name: <span className="text-red-500">*</span>
                </p>
                <Input
                  value={formData.guest_name}
                  onChange={(e) => handleInputChange("guest_name", e.target.value)}
                  className="h-9 rounded-md"
                  placeholder="Enter guest name"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Phone Number: <span className="text-red-500">*</span>
                </p>
                <Input.Group compact>
                  <Select
                    value={formData.country_code}
                    onChange={(value) => handleInputChange("country_code", value)}
                    style={{ width: "35%", height: 36 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {countryCodes.map((country) => (
                      <Select.Option key={country.value} value={country.value}>
                        {country.flag} {country.value}
                      </Select.Option>
                    ))}
                  </Select>
                  <Input
                    value={formData.guest_phone}
                    onChange={(e) => handleInputChange("guest_phone", e.target.value)}
                    style={{ width: "65%", height: 36 }}
                    placeholder="Phone number"
                    type="tel"
                  />
                </Input.Group>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Email:</p>
                <Input
                  value={formData.guest_email}
                  onChange={(e) => handleInputChange("guest_email", e.target.value)}
                  className="h-9 rounded-md"
                  placeholder="Enter email (optional)"
                  type="email"
                />
              </div>

              {orderType === "Dine-In" && (
                <div>
                  <p className="mb-1 text-sm text-gray-500">
                    Table Number: <span className="text-red-500">*</span>
                  </p>
                  <Input
                    value={formData.table_number}
                    onChange={(e) => handleInputChange("table_number", e.target.value)}
                    className="h-9 rounded-md"
                    placeholder="Enter table number"
                  />
                </div>
              )}

              {orderType === "Delivery" && (
                <div>
                  <p className="mb-1 text-sm text-gray-500">
                    Delivery Address: <span className="text-red-500">*</span>
                  </p>
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <Input
                      value={formData.guest_address}
                      onChange={(e) => handleInputChange("guest_address", e.target.value)}
                      className="h-9 rounded-md"
                      placeholder="Search and select address"
                      prefix={<EnvironmentOutlined />}
                    />
                  </Autocomplete>
                  {formData.guest_latitude && formData.guest_longitude && (
                    <p className="mt-1 text-xs text-green-600">✓ Location confirmed</p>
                  )}
                </div>
              )}

              <div>
                <p className="mb-1 text-sm text-gray-500">Order Note:</p>
                <Input.TextArea
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  className="rounded-md"
                  placeholder="Add special instructions (optional)"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* ORDER TYPE TABS */}
        <div className="m-4 flex gap-2 rounded-lg bg-[#C6FFCE] p-1">
          {tabs.map((tab) => {
            const isActive = orderType === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setOrderType(tab.key)}
                className={`flex-1 rounded-md py-2 font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#00BC1A] text-white shadow-sm"
                    : "text-[#0A3A1A] hover:bg-[#9BFFAA]/60"
                } `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-3 overflow-y-auto px-4">
          {cartItemsArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <p className="text-sm">No menu selected</p>
              <p className="text-xs">Please add items to begin an order</p>
            </div>
          ) : (
            cartItemsArray.map(({ item, qty, size, price }) => {
              const itemTotal = Number(price) * qty;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border p-3 shadow-sm"
                >
                  <img
                    src={item.media?.url}
                    className="h-14 w-14 rounded-md object-cover"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <p className="text-base font-bold text-[#1F5226]">{item.name}</p>
                    <p className="text-sm text-gray-700">{item.description}</p>

                    {item?.sizes?.length > 0 && (
                      <select
                        value={size}
                        onChange={(e) => {
                          const selected = e.target.value;
                          const selectedSizeObj = item.sizes.find((s) => s.name === selected);

                          setCart((prev) => ({
                            ...prev,
                            [item.id]: {
                              ...prev[item.id],
                              size: selected,
                              price: Number(selectedSizeObj?.price || item.base_price),
                            },
                          }));
                        }}
                        className="mt-2 w-full rounded-xl border px-3 py-2 text-sm"
                      >
                        {item.sizes.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name} — £{Number(s.price).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#00BC1A]">
                          £{Number(price).toFixed(2)}
                        </p>
                        <span className="text-xs text-gray-500">({size})</span>
                        <span className="text-xs text-gray-500">{qty}×</span>
                      </div>

                      <span className="text-base font-bold text-[#00BC1A]">
                        £{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="mx-4 mt-4 rounded-lg bg-[#F4F4F4] px-4 py-5">
          <div className="mb-1 flex justify-between text-sm font-medium">
            <span>Sub Total</span>
            <span>£{subTotal.toFixed(2)}</span>
          </div>
          <div className="border border-dashed" />
          <div className="mt-2 flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>£{subTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3 p-4">
          <Button
            block
            size="large"
            className="rounded-md !bg-[#0F5821] !text-white"
            onClick={handlePlaceOrder}
            loading={isLoading}
            disabled={cartItemsArray.length === 0}
          >
            Place Order
          </Button>

          {/* <Button
            block
            size="large"
            className="rounded-md border bg-white"
            icon={<PrinterIcon className="h-4 w-4" />}
          >
            Print receipt
          </Button> */}
        </div>
      </Drawer>

      {/* SUCCESS MODAL */}
      <SuccessModal
        isSuccessModalOpen={isSuccessModalOpen}
        handleCloseSuccessModal={handleCloseSuccessModal}
        orderData={orderData}
      />
    </LoadScript>
  );
};

export default OrderPanel;
