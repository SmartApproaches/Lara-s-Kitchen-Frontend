import React from "react";
import { Card, Button, Space, Typography, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { ICONS } from "../../../../../../../constants";
const { Text } = Typography;

const MenuSingleCard = ({ item, qty = 0, onAdd, onIncrement, onDecrement }) => {
  const price = parseFloat(item.displayPrice || 0).toFixed(2);
  const sizeName = item.displaySize || "large";
  const catergory = item?.subcategory?.name;
  const isOutOfStock = item?.availability === "out_of_stock";
  return (
    <Card
      hoverable={!isOutOfStock}
      style={{
        borderRadius: 20,
        padding: " 12px",
        overflow: "hidden",
        border: "1px solid #E9F9ED",
        backgroundColor: "#F9FFF9",
        boxShadow: "0 0 6px rgba(0,0,0,0.05)",
        transition: "0.3s",
        opacity: isOutOfStock ? 0.7 : 1,
      }}
      bodyStyle={{ padding: 2 }}
      cover={
        <div
          style={{
            backgroundColor: "#1F5226",
            height: 160,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            borderBottom: "1px solid #E9F9ED",
            position: "relative",
          }}
        >
          <img
            alt={item.name}
            src={item.media?.url}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      }
    >
      <div style={{ minHeight: 60, textAlign: "left" }}>
        <Text strong style={{ fontSize: 14, color: isOutOfStock ? "#999" : "#000" }}>
          {item.name}
        </Text>
        <div>
          <Text type="secondary" style={{ fontSize: 12, color: "#B2B2B2" }}>
            {item.description}
          </Text>
        </div>
      </div>

      <div className="flex items-center !justify-between">
        <div className="flex flex-col">
          <Text strong style={{ fontSize: 14, color: isOutOfStock ? "#999" : "#000" }}>
            £{price}
          </Text>
          <Text style={{ fontSize: 10, color: "#9CA3AF" }} className="capitalize">
            Size: {sizeName}
          </Text>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#EEFFF1] px-2 py-1">
          <img
            src={
              catergory === "Swallow"
                ? ICONS.swallowIcon
                : catergory === "Grains"
                  ? ICONS.grainsIcon
                  : ICONS.grainsIcon
            }
            alt=""
            style={{ opacity: isOutOfStock ? 0.5 : 1 }}
          />
          <p className="text-[10px] text-[#00BC1A]" style={{ opacity: isOutOfStock ? 0.5 : 1 }}>
            {catergory}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        {qty === 0 ? (
          <Button
            block
            disabled={isOutOfStock}
            style={{
              backgroundColor: isOutOfStock ? "#D9D9D9" : "#154A2F",
              color: isOutOfStock ? "#999" : "#fff",
              height: 38,
              borderRadius: 20,
              fontWeight: 500,
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
            onClick={isOutOfStock ? undefined : onAdd}
          >
            {isOutOfStock ? "Out of Stock" : "Add Dish"}
          </Button>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#F2F2F2",
              borderRadius: 20,
              height: 38,
              padding: "0 8px",
            }}
          >
            <Button
              shape="circle"
              size="small"
              icon={<MinusOutlined />}
              onClick={onDecrement}
              disabled={isOutOfStock}
              style={{
                border: "none",
                backgroundColor: isOutOfStock ? "#E0E0E0" : "#D9D9D9",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            />
            <Text strong style={{ color: isOutOfStock ? "#999" : "#000" }}>
              {qty}
            </Text>
            <Button
              shape="circle"
              size="small"
              icon={<PlusOutlined />}
              onClick={onIncrement}
              disabled={isOutOfStock}
              style={{
                border: "none",
                backgroundColor: isOutOfStock ? "#E0E0E0" : "#154A2F",
                color: isOutOfStock ? "#999" : "#fff",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuSingleCard;
