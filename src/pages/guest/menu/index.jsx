import React, { useState, useEffect, useRef } from "react";
import {
  useGetDineInMenusQuery,
  usePlaceDineInOrderMutation,
} from "../../../redux/slices/cashier/dineIn";
import { Modal, Badge, Input, message, Skeleton } from "antd";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  FireOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { IMAGES } from "../../../constants";
import toast from "react-hot-toast";

const DineInMenu = () => {
  const [page, setPage] = useState(1);
  const [allMenus, setAllMenus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadedPages, setLoadedPages] = useState(new Set([1]));

  // Query for current page
  const {
    data: dineInMenu,
    isLoading,
    isFetching,
  } = useGetDineInMenusQuery(page, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  // Always poll page 1 in the background for real-time updates
  const { data: page1Data } = useGetDineInMenusQuery(1, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    skip: page === 1, // Skip if we're already on page 1
  });

  const observerTarget = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceDineInOrderMutation();
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Update page 1 data in real-time (background polling)
  useEffect(() => {
    if (page1Data?.data?.data && page > 1) {
      const page1Items = page1Data.data.data;

      setAllMenus((prev) => {
        // Create a map of all current items by ID
        const itemsMap = new Map(prev.map((item) => [item.id, item]));

        // Update page 1 items
        page1Items.forEach((item) => {
          itemsMap.set(item.id, item);
        });

        // Convert back to array, maintaining order (page 1 items first)
        const page1Ids = new Set(page1Items.map((i) => i.id));
        const updatedPage1 = page1Items;
        const otherPages = prev.filter((item) => !page1Ids.has(item.id));

        return [...updatedPage1, ...otherPages];
      });
    }
  }, [page1Data, page]);

  // Update menus when new data is fetched (current page)
  useEffect(() => {
    if (dineInMenu?.data?.data) {
      const newMenus = dineInMenu.data.data;
      const pagination = dineInMenu.data;

      setAllMenus((prev) => {
        if (pagination.current_page === 1) {
          // For page 1, replace all page 1 items
          setLoadedPages(new Set([1]));
          return newMenus;
        } else {
          // For other pages, merge intelligently
          const itemsMap = new Map(prev.map((item) => [item.id, item]));

          // Add/update new items
          newMenus.forEach((item) => {
            itemsMap.set(item.id, item);
          });

          // Track loaded pages
          setLoadedPages((prevPages) => new Set([...prevPages, pagination.current_page]));

          // Convert map back to array
          return Array.from(itemsMap.values());
        }
      });

      setHasMore(pagination.current_page < pagination.last_page);
    }
  }, [dineInMenu]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isFetching]);

  // Image component with error handling - NO spinner on re-render
  const MenuImage = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const isInitialLoad = useRef(true);

    useEffect(() => {
      // Only update if the src actually changed to a different URL
      if (src !== imgSrc) {
        setImgSrc(src);
        setHasError(false);
      }
      isInitialLoad.current = false;
    }, [src]);

    const handleError = () => {
      setHasError(true);
      // Fallback to placeholder image
      setImgSrc("https://via.placeholder.com/400x300/1F5226/FFFFFF?text=No+Image");
    };

    return (
      <img src={imgSrc} alt={alt} className={className} onError={handleError} loading="lazy" />
    );
  };

  // Add to Cart
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    message.success("Item added to cart");
  };

  // Adjust quantity
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalPrice = cart.reduce((sum, i) => sum + Number(i.base_price) * i.qty, 0);

  // Place Order
  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) {
      toast.error("Table number is required", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#1F5226",
          fontWeight: 600,
        },
        icon: "⚠️",
      });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#1F5226",
          fontWeight: 600,
        },
        icon: "🛒",
      });
      return;
    }

    const orderBody = {
      order_type: "dine_in",
      table_number: tableNumber,
      note: "",
      items: cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.qty,
      })),
    };

    try {
      const res = await placeOrder(orderBody).unwrap();
      setOrderSuccess(res.data);
      setCart([]);
      setIsCartOpen(false);
      setTableNumber("");
      toast.success("Order placed successfully!", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#1F5226",
          fontWeight: 600,
        },
        icon: "✅",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order", {
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#1F5226",
          fontWeight: 600,
        },
        icon: "❌",
      });
    }
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <Skeleton.Image active className="!h-28 !w-full sm:!h-36" />
      <div className="p-2.5 sm:p-3">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FFF4] to-[#F8FFFA] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
        <h1 className="text-2xl font-extrabold text-[#1F5226] sm:text-3xl">Welcome 👋</h1>
        <p className="text-xs text-[#69B47A] sm:text-sm">Find your next delicious meal!</p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4">
        {isLoading && page === 1 ? (
          // Initial Loading Skeletons
          <>
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : allMenus.length === 0 ? (
          <div className="col-span-2 py-20 text-center text-gray-500 sm:col-span-3 lg:col-span-4">
            No menu items available
          </div>
        ) : (
          <>
            {allMenus.map((item) => (
              <div
                key={item.id}
                className={`group flex transform flex-col overflow-hidden rounded-2xl bg-[#F7F7F7] shadow-sm transition-all duration-300 hover:shadow-xl ${
                  item.availability === "out_of_stock"
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:-translate-y-1"
                }`}
                onClick={() => item.availability !== "out_of_stock" && setSelectedItem(item)}
              >
                <div className="relative overflow-hidden">
                  <MenuImage
                    src={item.media?.url}
                    alt={item.name}
                    className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-36"
                  />
                  {item.availability === "out_of_stock" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-bold text-[#1F5226] sm:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                      {item.category?.name}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-base font-bold text-[#1F5226] sm:text-lg">
                      £{item.base_price}
                    </p>
                    {item.availability !== "out_of_stock" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F5226] text-white shadow-md transition-all hover:bg-[#2E6B38] hover:shadow-lg active:scale-95 sm:h-8 sm:w-8"
                      >
                        <PlusOutlined className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isFetching && page > 1 && (
        <div className="grid grid-cols-2 gap-3 px-3 pb-6 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasMore && <div ref={observerTarget} className="h-10" />}

      {/* End of results message */}
      {!hasMore && allMenus.length > 0 && (
        <div className="pb-6 text-center text-sm text-gray-500">
          You've reached the end of the menu
        </div>
      )}

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="animate-slide-up fixed right-0 bottom-0 left-0 z-30 mx-auto max-w-2xl">
          <div className="m-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] p-3.5 text-white shadow-2xl sm:m-4 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Badge count={cart.length} color="#80D48B" className="shadow-sm">
                <div className="rounded-full bg-white/20 p-2">
                  <ShoppingCartOutlined className="text-lg sm:text-xl" />
                </div>
              </Badge>
              <div>
                <p className="text-xs font-medium opacity-90 sm:text-sm">Your Order</p>
                <p className="text-sm font-bold sm:text-base">
                  {cart.length} item{cart.length > 1 && "s"} • £{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#1F5226] shadow-md transition-all hover:shadow-lg active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <Modal
        open={isCartOpen}
        footer={null}
        onCancel={() => setIsCartOpen(false)}
        centered
        width="95%"
        style={{ maxWidth: "500px" }}
        bodyStyle={{ background: "#F8FFFA", borderRadius: "20px", padding: "20px" }}
      >
        <h2 className="mb-1 text-xl font-bold text-[#1F5226] sm:text-2xl">Checkout</h2>
        <p className="mb-4 text-xs text-gray-500 sm:text-sm">Review your order</p>

        <div className="max-h-[50vh] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[55vh]">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-sm sm:gap-3 sm:p-3"
            >
              <MenuImage
                src={item.media?.url}
                alt={item.name}
                className="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1F5226] sm:text-base">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 sm:text-sm">£{item.base_price} each</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 active:scale-95"
                >
                  <MinusOutlined className="text-xs" />
                </button>
                <span className="w-6 text-center text-sm font-semibold sm:w-7">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 active:scale-95"
                >
                  <PlusOutlined className="text-xs" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 active:scale-95"
                >
                  <DeleteOutlined className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-white p-3 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-[#1F5226]">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-xs font-semibold text-[#1F5226] sm:text-sm">
            Table Number *
          </label>
          <Input
            placeholder="Enter table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="h-11 rounded-xl border-2 border-[#1F5226]/20 transition focus:border-[#1F5226]"
            size="large"
          />
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlacingOrder ? "Placing Order..." : `Place Order • £${totalPrice.toFixed(2)}`}
        </button>
      </Modal>

      {/* Food Details Modal */}
      <Modal
        open={!!selectedItem}
        footer={null}
        onCancel={() => setSelectedItem(null)}
        centered
        width="95%"
        style={{ maxWidth: "520px" }}
        bodyStyle={{
          padding: 0,
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "#FDFDFD",
        }}
      >
        {selectedItem && (
          <div className="relative">
            {/* Hero Image */}
            <div className="relative h-52 overflow-hidden sm:h-64">
              <MenuImage
                src={selectedItem.media?.url}
                alt={selectedItem.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/5 to-transparent" />

              {/* Price Badge */}
              <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
                <p className="text-base font-semibold text-[#1F5226] sm:text-lg">
                  £{selectedItem.base_price}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 -mt-4 rounded-t-3xl bg-white p-5 shadow-inner sm:p-6">
              {/* Title & Category */}
              <div className="mb-3">
                <h2 className="text-xl font-bold text-[#1F5226] sm:text-2xl">
                  {selectedItem.name}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EB] px-2.5 py-0.5 text-[11px] font-medium text-[#1F5226]">
                    <TagOutlined className="text-[10px]" />
                    {selectedItem.category?.name}
                  </span>
                  {selectedItem.subcategory?.name && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700">
                      {selectedItem.subcategory.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="mb-3 grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/30 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5226]/10">
                    <ClockCircleOutlined className="text-base text-[#1F5226]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-600">Prep Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedItem.preparation_time || "15 min"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-red-50 to-red-100/30 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                    <FireOutlined className="text-base text-red-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-600">Calories</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedItem.calorie_size || "250"} kcal
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 rounded-lg bg-gray-50 p-3.5">
                <h3 className="mb-1 text-[13px] font-semibold text-gray-700">Description</h3>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  {selectedItem.description ||
                    "A delicious menu item carefully prepared with fresh ingredients and served with love. Perfect for any occasion!"}
                </p>
              </div>

              {/* CTA */}
              <div>
                {selectedItem.availability === "out_of_stock" ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 py-3 text-center">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold text-red-600">
                      Currently Unavailable
                    </span>
                  </div>
                ) : (
                  <button
                    className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      <ShoppingCartOutlined className="text-sm" />
                      Add to Cart
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        open={!!orderSuccess}
        footer={null}
        onCancel={() => setOrderSuccess(null)}
        centered
        width="95%"
        style={{ maxWidth: "400px" }}
        bodyStyle={{ padding: "32px", borderRadius: "24px", textAlign: "center" }}
      >
        {orderSuccess && (
          <div className="flex flex-col items-center">
            <img src={IMAGES.sucessImage} alt="sucessImage" />

            <h2 className="mb-2 text-2xl font-bold text-[#1F5226]">Order Placed</h2>
            <p className="mb-6 text-sm text-gray-600">
              Your order has been received, you will soon be served
            </p>

            <div className="w-full space-y-3 rounded-xl bg-gray-50 p-4 text-left">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-600">Table Number:</span>
                <span className="text-sm font-bold text-[#1F5226]">
                  {orderSuccess.table_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Order Number:</span>
                <span className="text-sm font-bold text-[#1F5226]">
                  {orderSuccess.order_number}
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              Continue Ordering
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DineInMenu;
