import React, { useState, useEffect, useRef } from "react";
import {
  useGetDineInMenusQuery,
  usePlaceDineInOrderMutation,
} from "../../../redux/slices/cashier/dineIn";
import { message } from "antd";
import toast from "react-hot-toast";
import MenuCard from "../menuCard";
import MenuDetails from "../details";
import CartModal from "../cart";
import SuccessModal from "../sucessModal";
import SkeletonCard from "../components/SkeletonCard";
import FloatingCart from "../cart/FloatingCart";

const DineInMenu = () => {
  const [page, setPage] = useState(1);
  const [allMenus, setAllMenus] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [note, setNote] = useState("");
  const imageCache = new Map();
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
  // console.log("page1Data", page1Data);
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

  // Add to Cart
  const addToCart = (item, selectedSize = null) => {
    const defaultSize =
      selectedSize || item.sizes?.find((s) => s.name === "large") || item.sizes?.[0];

    const cartId = `${item.id}-${defaultSize.name}`;

    const existing = cart.find((c) => c.cartId === cartId);

    if (existing) {
      setCart(cart.map((c) => (c.cartId === cartId ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([
        ...cart,
        {
          ...item,
          cartId,
          selectedSize: defaultSize.name,
          base_price: defaultSize.price,
          qty: 1,
        },
      ]);
    }

    message.success("Item added to cart");
  };

  // Adjust quantity

  const updateQty = (cartId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  const removeItem = (cartId) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateSize = (cartId, newSize) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newSizeData = item.sizes.find((s) => s.name === newSize);

          return {
            ...item,
            cartId: `${item.id}-${newSize}`, // ✅ update cart key
            selectedSize: newSize,
            base_price: newSizeData.price, // ✅ update price
          };
        }
        return item;
      }),
    );
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
      note: note,
      items: cart.map((item) => ({
        menu_item_id: item.id,
        size: item.selectedSize, // ✅ REQUIRED BY BACKEND
        quantity: item.qty,
      })),
    };

    try {
      const res = await placeOrder(orderBody).unwrap();
      setOrderSuccess(res.data);
      setCart([]);
      setNote("");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FFF4] to-[#F8FFFA] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
        <h1 className="text-2xl font-extrabold text-[#1F5226] sm:text-3xl">Welcome 👋</h1>
        <p className="text-xs text-[#69B47A] sm:text-sm">Find your next delicious meal!</p>
      </div>

      <MenuCard
        isLoading={isLoading}
        page={page}
        allMenus={allMenus}
        setSelectedItem={setSelectedItem}
        addToCart={addToCart}
        imageCache={imageCache}
      />

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

      <FloatingCart cart={cart} totalPrice={totalPrice} setIsCartOpen={setIsCartOpen} />
      <CartModal
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        note={note}
        updateSize={updateSize}
        setNote={setNote}
        totalPrice={totalPrice}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        handlePlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
      />

      {/* Food Details Modal */}

      <MenuDetails
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        addToCart={addToCart}
      />

      {/* Success Modal */}

      <SuccessModal orderSuccess={orderSuccess} setOrderSuccess={setOrderSuccess} />
    </div>
  );
};

export default DineInMenu;
