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
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [note, setNote] = useState("");
  const imageCache = new Map();
  const [loadedPages, setLoadedPages] = useState(new Set([1]));
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });

  const {
    data: dineInMenu,
    isLoading,
    isFetching,
  } = useGetDineInMenusQuery(page, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  const { data: page1Data } = useGetDineInMenusQuery(1, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    skip: page === 1,
  });

  const observerTarget = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceDineInOrderMutation();
  const [orderSuccess, setOrderSuccess] = useState(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyAdj9yCjRwmShW7rJbvHlEcyfMsztXw_iE";
  // ✅ BACKGROUND SYNC FOR PAGE 1
  useEffect(() => {
    if (page1Data?.data?.data && page > 1) {
      const page1Items = page1Data.data.data;

      setAllMenus((prev) => {
        const itemsMap = new Map(prev.map((item) => [item.id, item]));
        page1Items.forEach((item) => itemsMap.set(item.id, item));

        const page1Ids = new Set(page1Items.map((i) => i.id));
        const updatedPage1 = page1Items;
        const otherPages = prev.filter((item) => !page1Ids.has(item.id));

        return [...updatedPage1, ...otherPages];
      });
    }
  }, [page1Data, page]);

  // ✅ LOAD MENUS BY PAGE
  useEffect(() => {
    if (dineInMenu?.data?.data) {
      const newMenus = dineInMenu.data.data;
      const pagination = dineInMenu.data;

      setAllMenus((prev) => {
        if (pagination.current_page === 1) {
          setLoadedPages(new Set([1]));
          return newMenus;
        } else {
          const itemsMap = new Map(prev.map((item) => [item.id, item]));
          newMenus.forEach((item) => itemsMap.set(item.id, item));
          setLoadedPages((prevPages) => new Set([...prevPages, pagination.current_page]));
          return Array.from(itemsMap.values());
        }
      });

      setHasMore(pagination.current_page < pagination.last_page);
    }
  }, [dineInMenu]);

  // ✅ SEARCH FILTER
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMenus(allMenus);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = allMenus.filter((item) => item.name?.toLowerCase().includes(lower));
      setFilteredMenus(filtered);
    }
  }, [searchTerm, allMenus]);

  // ✅ INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !searchTerm) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, isFetching, searchTerm]);

  // ✅ ADD TO CART
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
            cartId: `${item.id}-${newSize}`,
            selectedSize: newSize,
            base_price: newSizeData.price,
          };
        }
        return item;
      }),
    );
  };

  const totalPrice = cart.reduce((sum, i) => sum + Number(i.base_price) * i.qty, 0);
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = parseFloat(position.coords.latitude);
        const lng = parseFloat(position.coords.longitude);

        let address = "";

        try {
          // 🔹 OPTIONAL: Reverse geocode using Google
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
          );
          const data = await res.json();
          address = data?.results?.[0]?.formatted_address || "";
        } catch (err) {
          console.warn("Failed to resolve address");
        }

        setLocation({
          latitude: lat,
          longitude: lng,
          address,
        });
      },
      (error) => {
        console.error("Location error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) {
      toast.error("Table number is required");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!location.latitude || !location.longitude) {
      toast.error("Unable to verify your location");
      return;
    }

    const orderBody = {
      order_type: "dine_in",
      table_number: tableNumber,
      note: note,
      latitude: location.latitude, // ✅ number
      longitude: location.longitude, // ✅ number
      address: location.address, // ✅ string
      items: cart.map((item) => ({
        menu_item_id: item.id,
        size: item.selectedSize,
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
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FFF4] to-[#F8FFFA] pb-28">
      {/* ✅ HEADER + SEARCH */}
      <div className="sticky top-0 z-20 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1F5226] sm:text-3xl">Welcome 👋</h1>
            <p className="text-xs text-[#69B47A] sm:text-sm">Find your next delicious meal!</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#1F5226]"
            />
            <button className="rounded-xl bg-[#1F5226] px-5 py-2 text-sm font-semibold text-white">
              Search
            </button>
          </div>
        </div>
      </div>

      <MenuCard
        isLoading={isLoading}
        page={page}
        allMenus={filteredMenus}
        setSelectedItem={setSelectedItem}
        addToCart={addToCart}
        imageCache={imageCache}
      />

      {filteredMenus.length === 0 && !isLoading && (
        <div className="py-10 text-center text-gray-500">No food found for "{searchTerm}"</div>
      )}

      {isFetching && page > 1 && (
        <div className="grid grid-cols-2 gap-3 px-3 pb-6 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={`loading-${i}`} />
          ))}
        </div>
      )}

      {!searchTerm && hasMore && <div ref={observerTarget} className="h-10" />}

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

      <MenuDetails
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        addToCart={addToCart}
      />

      <SuccessModal orderSuccess={orderSuccess} setOrderSuccess={setOrderSuccess} />
    </div>
  );
};

export default DineInMenu;
