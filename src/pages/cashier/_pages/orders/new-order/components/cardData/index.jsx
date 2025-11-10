import React from "react";
import { Card, Button, Space, Typography, Tag } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { ICONS } from "../../../../../../../constants";
const { Text } = Typography;

const MenuSingleCard = ({ item, qty = 0, onAdd, onIncrement, onDecrement }) => {
  const price = parseFloat(item.base_price || 0).toFixed(2);
  const catergory = item?.subcategory?.name;
  console.log("item", item);
  return (
    <Card
      hoverable
      style={{
        borderRadius: 20,
        padding: " 12px",
        overflow: "hidden",
        border: "1px solid #E9F9ED",
        backgroundColor: "#F9FFF9",
        boxShadow: "0 0 6px rgba(0,0,0,0.05)",
        transition: "0.3s",
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
        <Text strong style={{ fontSize: 14 }}>
          {item.name}
        </Text>
        <div>
          <Text type="secondary" style={{ fontSize: 12, color: "#B2B2B2" }}>
            {item.description}
          </Text>
        </div>
      </div>

      <div className="flex items-center !justify-between">
        <Text strong style={{ fontSize: 14 }}>
          £{price}
        </Text>
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
          />
          <p className="text-[10px] text-[#00BC1A]">{catergory}</p>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        {qty === 0 ? (
          <Button
            block
            style={{
              backgroundColor: "#154A2F",
              color: "#fff",
              height: 38,
              borderRadius: 20,
              fontWeight: 500,
            }}
            onClick={onAdd}
          >
            Add Dish
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
              style={{
                border: "none",
                backgroundColor: "#D9D9D9",
              }}
            />
            <Text strong>{qty}</Text>
            <Button
              shape="circle"
              size="small"
              icon={<PlusOutlined />}
              onClick={onIncrement}
              style={{
                border: "none",
                backgroundColor: "#154A2F",
                color: "#fff",
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuSingleCard;
