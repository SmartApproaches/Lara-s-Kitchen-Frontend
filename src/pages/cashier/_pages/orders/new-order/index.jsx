import React, { useMemo, useState } from "react";
import { Row, Col, Typography, Skeleton, Pagination } from "antd";

import StatCard from "./components/statCardData";
import {
  useGetCashierdMenuQuery,
  useGetCashierMenuCategoriesQuery,
} from "../../../../../redux/slices/cashier/menuApiSlice";
import MenuSingleCard from "./components/cardData";
import { ICONS } from "../../../../../constants";
import OrderPanel from "./components/orderPanel";
const { Title, Text } = Typography;

const NewOrder = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  // cart shape: { [menuId]: { item: <menuItem>, qty: number } }
  const [cart, setCart] = useState({});

  const drawerOpen = Object.keys(cart).length > 0;

  const { data: categoryData } = useGetCashierMenuCategoriesQuery();
  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    refetch,
  } = useGetCashierdMenuQuery({
    page,
    per_page: limit,
    ...(activeCategoryId && { category_id: activeCategoryId }),
  });

  // Build category chips including All
  const cardData = useMemo(() => {
    if (!categoryData?.data || !menuData?.data) {
      return [
        {
          id: "all",
          icons: ICONS.allOrder,
          title: "All",
          quantity: `0 items`,
          categoryId: "",
        },
      ];
    }

    const categories = categoryData.data;
    const totalItems = menuData.data.total || 0;

    const allCard = {
      id: "all",
      icons: ICONS.allOrder,
      title: "All",
      quantity: `${totalItems} items`,
      categoryId: "",
    };

    const categoryCards = categories.map((category) => {
      const categoryItems =
        menuData.data.data?.filter((item) => item.category_id === category.id).length || 0;

      return {
        id: category.id,
        icons: category.name === "Food" ? ICONS.bowIcon : ICONS.carbonDrink,
        title: category.name,
        quantity: `${categoryItems} items`,
        categoryId: category.id,
      };
    });

    return [allCard, ...categoryCards];
  }, [categoryData, menuData]);

  const handleCardClick = (categoryId, title) => {
    setActiveTab(title);
    setActiveCategoryId(categoryId);
    setPage(1);
  };

  // helpers to manage cart
  const addToCart = (menuItem) => {
    setCart((prev) => {
      const existing = prev[menuItem.id];
      if (existing) return prev; // already exists (shouldn't happen if card switches to controls)
      return { ...prev, [menuItem.id]: { item: menuItem, qty: 1 } };
    });
  };

  const incrementQty = (menuId) => {
    setCart((prev) => {
      const entry = prev[menuId];
      if (!entry) return prev;
      return { ...prev, [menuId]: { ...entry, qty: entry.qty + 1 } };
    });
  };

  const decrementQty = (menuId) => {
    setCart((prev) => {
      const entry = prev[menuId];
      if (!entry) return prev;
      const newQty = entry.qty - 1;
      const copy = { ...prev };
      if (newQty <= 0) {
        delete copy[menuId];
        return copy;
      }
      copy[menuId] = { ...entry, qty: newQty };
      return copy;
    });
  };

  // calculate totals
  const cartItemsArray = Object.values(cart);
  const subTotal = cartItemsArray.reduce(
    (s, c) => s + parseFloat(c.item.base_price || 0) * c.qty,
    0,
  );

  // pages info
  const currentPage = menuData?.data?.current_page || 1;
  const perPage = menuData?.data?.per_page || limit;
  const total = menuData?.data?.total || 0;

  // menu list
  const menuList = menuData?.data?.data || [];

  return (
    <div className={`min-h-screen p-6 ${drawerOpen ? "w-[75%]" : "w-full"}`}>
      <div className="mb-6 flex items-center justify-between">
        <Title level={3} style={{ color: "#1F5226", margin: 0 }}>
          New Order
        </Title>
      </div>

      {/* category chips */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        {cardData.map((card) => (
          <div key={card.id} onClick={() => handleCardClick(card.categoryId, card.title)}>
            <StatCard
              icons={card.icons}
              title={card.title}
              quantity={card.quantity}
              isActive={activeTab === card.title}
            />
          </div>
        ))}
      </div>

      {/* menu grid - adjusts based on drawer state */}
      {menuLoading || menuFetching ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={drawerOpen ? 8 : 6}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {menuList.map((menuItem) => {
              const inCart = cart[menuItem.id]?.qty || 0;
              return (
                <Col key={menuItem.id} xs={24} sm={12} md={8} lg={drawerOpen ? 8 : 6}>
                  <MenuSingleCard
                    item={menuItem}
                    qty={inCart}
                    onAdd={() => addToCart(menuItem)}
                    onIncrement={() => incrementQty(menuItem.id)}
                    onDecrement={() => decrementQty(menuItem.id)}
                  />
                </Col>
              );
            })}
          </Row>

          {/* pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={perPage}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <OrderPanel
        drawerOpen={drawerOpen}
        setCart={setCart}
        cartItemsArray={cartItemsArray}
        decrementQty={decrementQty}
        incrementQty={incrementQty}
        subTotal={subTotal}
      />
    </div>
  );
};

export default NewOrder;
