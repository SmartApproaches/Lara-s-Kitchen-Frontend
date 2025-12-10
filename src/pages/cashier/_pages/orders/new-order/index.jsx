import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Typography, Skeleton, Pagination } from "antd";
import StatCard from "./components/statCardData";
import {
  useGetCashierdMenuQuery,
  useGetCashierMenuCategoriesQuery,
} from "../../../../../redux/slices/cashier/menuApiSlice";
import MenuSingleCard from "./components/cardData";
import { ICONS } from "../../../../../constants";
import OrderPanel from "./components/orderPanel";
const { Title } = Typography;

const NewOrder = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [cart, setCart] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    setIsDrawerOpen(true);
  }, []);
  const location = useLocation();

  // Queries
  const { data: categoryData, refetch: refetchCategories } = useGetCashierMenuCategoriesQuery({
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
  });

  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    refetch: refetchMenu,
  } = useGetCashierdMenuQuery(
    {
      page,
      per_page: limit,
      ...(activeCategoryId && { category_id: activeCategoryId }),
    },
    {
      pollingInterval: 3000,
      skipPollingIfUnfocused: true,
    },
  );

  // 👇 Force refresh every time this route is opened
  useEffect(() => {
    refetchCategories();
    refetchMenu();
  }, [location.pathname]); // Runs each time user navigates to /new-order (or this page's route)

  // Build category chips...
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

  // CART HELPERS...
  const addToCart = (menuItem) => {
    const defaultSize = menuItem?.sizes?.[0]?.name || "large";

    const defaultPrice = Number(menuItem?.sizes?.[0]?.price || menuItem.base_price || 0);

    setCart((prev) => ({
      ...prev,
      [menuItem.id]: {
        item: menuItem,
        qty: 1,
        size: defaultSize,
        price: defaultPrice,
      },
    }));

    setIsDrawerOpen(true);
  };
  const incrementQty = (menuId) => {
    setCart((prev) => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        qty: prev[menuId].qty + 1,
      },
    }));
  };

  const decrementQty = (menuId) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[menuId].qty <= 1) delete copy[menuId];
      else copy[menuId].qty -= 1;
      return copy;
    });
  };

  const cartItemsArray = Object.values(cart);
  const subTotal = cartItemsArray.reduce((sum, cart) => sum + Number(cart.price) * cart.qty, 0);

  const currentPage = menuData?.data?.current_page || 1;
  const perPage = menuData?.data?.per_page || limit;
  const total = menuData?.data?.total || 0;
  const rawMenuList = menuData?.data?.data || [];

  const menuList = rawMenuList.map((item) => {
    const largeSize = item?.sizes?.find((s) => s?.name?.toLowerCase() === "large");

    return {
      ...item,
      displayPrice: parseFloat(largeSize?.price || item.base_price || 0), // ✅ Large as base
      displaySize: largeSize?.name || "large", // ✅ Show size
    };
  });

  return (
    <div className={`min-h-screen p-6 ${isDrawerOpen ? "w-[75%]" : "w-full"}`}>
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

      {/* menu grid */}
      {menuLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={isDrawerOpen ? 8 : 6}>
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
                <Col key={menuItem.id} xs={24} sm={12} md={8} lg={isDrawerOpen ? 8 : 6}>
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
        drawerOpen={isDrawerOpen}
        setCart={setCart}
        setIsDrawerOpen={setIsDrawerOpen}
        cartItemsArray={cartItemsArray}
        decrementQty={decrementQty}
        incrementQty={incrementQty}
        subTotal={subTotal}
      />
    </div>
  );
};

export default NewOrder;
