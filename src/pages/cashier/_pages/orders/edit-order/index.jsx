// import React from "react";
import { ICONS, IMAGES } from "../../../../../constants";
import React, { useState } from "react";
import { Card } from "antd";
import { PlusSignIcon, MinusSignIcon } from "hugeicons-react";
import OrderSidePanel from "../order-sidepanel";
const categories = [
  { key: "all", label: "All", icon: ICONS.allorderIcon, count: 150 },
  { key: "food", label: "Food", icon: ICONS.foodIcon, count: 30 },
  { key: "drinks", label: "Drinks", icon: ICONS.drinksIcon, count: 50 },
  { key: "protein", label: "Protein", icon: ICONS.proteinIcon, count: 20 },
  { key: "extras", label: "Extras", icon: ICONS.extrasIcon, count: 20 },
];

const items = [
  {
    id: 1,
    name: "1 plate of Amala",
    description: "1 wrap of Amala, 1 Beef, 1 Ponmo, Gbegiri and Ewedu",
    price: 12,
    category: "food",
    image: IMAGES.abula,
  },
  {
    id: 2,
    name: "1 plate of Semo",
    description: "1 wrap of Amala, 1 Beef, 1 Ponmo, Gbegiri and Ewedu",
    price: 12,
    category: "food",
    image: ICONS.efoIcon,
  },
  {
    id: 3,
    name: "Jollof Rice",
    description: "Jollof Rice, Chicken, Plantain/Salad",
    price: 12,
    category: "food",
    image: ICONS.jollofRice,
  },
  {
    id: 4,
    name: "Coca Cola",
    description: "Chilled bottle drink",
    price: 3,
    category: "drinks",
    image: IMAGES.abula,
  },
];

const EditOrder = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const filteredItems =
    activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const updated = { ...prev, [id]: prev[id] - 1 };
      if (updated[id] <= 0) delete updated[id];
      return updated;
    });
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${selectedOrder ? "w-3/4" : "w-full"}`}
    >
      <h1 className="mb-6 text-2xl font-semibold">New Order</h1>

      {/* Category Tabs */}
      <div className="mb-6 grid w-full grid-cols-2 items-center justify-between gap-3 md:grid-cols-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex w-full flex-col items-center justify-center rounded-xl border px-6 py-4 transition md:items-start ${
              activeCategory === cat.key
                ? "border-green-500 bg-green-200"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-xl">
              <img src={cat.icon} alt={cat.label} />
            </div>
            <div className="font-medium">{cat.label}</div>
            <div className="text-sm text-gray-500">{cat.count} items</div>
          </button>
        ))}
      </div>

      {/* Items */}
      <div className={`grid gap-4 ${selectedOrder ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        {filteredItems.map((item) => (
          <Card
            className={`cursor-pointer rounded-2xl transition-all duration-300`}
            bodyStyle={{ padding: "1rem" }}
            onClick={() => setSelectedOrder(item)}
          >
            <div className="bg-primary relative flex items-center justify-center gap-3 rounded-2xl py-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-36 w-36 rounded-xl object-contain"
              />
            </div>
            <h3 className="text-md mt-2.5 font-bold text-black">{item.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-primary font-bold">£{item.price.toFixed(2)}</span>

              <div className="bg-primary flex items-center justify-center rounded-full px-2 py-1">
                <MinusSignIcon
                  className="h-3 w-3 text-white"
                  onClick={() => removeFromCart(item.id)}
                />
                <span className="bg-accent text-primary mx-2 rounded-md px-2 text-xs font-bold select-none">
                  {cart[item.id] || 0}
                </span>
                <PlusSignIcon className="h-3 w-3 text-white" onClick={() => addToCart(item.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedOrder && (
        <div className="w-1/4 transition-all duration-300">
          <OrderSidePanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
      )}
    </div>
  );
};

export default EditOrder;
