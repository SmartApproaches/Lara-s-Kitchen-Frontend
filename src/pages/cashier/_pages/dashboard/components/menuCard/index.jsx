import React, { useState } from "react";
import { Card, Row, Col, Switch, Dropdown, Button } from "antd";

import { IMAGES } from "../../../../../../constants";
const menuItems = [
  {
    id: 1,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula, // placeholder food image
    available: true,
  },
  {
    id: 2,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula,
    available: false,
  },
  {
    id: 3,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula,
    available: true,
  },
  {
    id: 4,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula,
    available: true,
  },
  {
    id: 5,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula,
    available: false,
  },
  {
    id: 6,
    name: "Abula",
    desc: "1 wrap of Amala, Meat, Ponmo, Gbegiri and Ewedu",
    price: 12,
    image: IMAGES.abula,
    available: true,
  },
];
const MenuCard = () => {
  const [items, setItems] = useState(menuItems);

  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
    );
  };
  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.id} xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "12px" }}
            className="flex flex-col !bg-[#F7F7F7]"
          >
            <div className="flex gap-3">
              {/* Food Image */}
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="text-primary text-xl font-bold">{item.name}</h4>
                  <p className="text-primary text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold text-green-700">£{item.price.toFixed(2)}</span>
              <Switch
                checked={item.available}
                onChange={() => handleToggle(item.id)}
                checkedChildren=""
                unCheckedChildren=""
                style={{
                  backgroundColor: item.available ? "#195B38" : "#ff4d4f",
                }}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MenuCard;
