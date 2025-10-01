import React, { useState } from "react";
import { Drawer, Avatar, Tag, Button, Collapse, Divider } from "antd";
import { ArrowDown01Icon, ArrowUp01Icon } from "hugeicons-react";

const { Panel } = Collapse;

const PendingOrderDrawer = ({ orderData, onClose, onMarkAsPreparing, onMarkAsReady, onCancel }) => {
  const [activeKey, setActiveKey] = useState(["1"]);

  const createDetailedOrderData = (basicOrder) => {
    if (!basicOrder) return null;

    return {
      id: basicOrder.id,
      type: basicOrder.type,
      customer: {
        name: basicOrder.customer || "Unknown Customer",
        phone: "+44 20 7123 4567",
        tableNumber: "Table 4",
      },
      items: [
        {
          id: 1,
          name: "Abula",
          description: "A bowl of Amala, meat, Pepper, Ewedu",
          price: 12.0,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop&crop=face",
        },
        {
          id: 2,
          name: "Semo",
          description: "A bowl of Semo, Chicken, Fish",
          price: 12.0,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop&crop=center",
        },
        {
          id: 3,
          name: "Jollof Rice",
          description: "Bowl of Jollof rice, Chicken and Fish",
          price: 12.0,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1604329760661-e71dc83f8385?w=80&h=80&fit=crop&crop=center",
        },
      ],
      specialNotes: [
        "uncontacted tempor fauchibus lorem bibendum",
        "efficitur lacus lorem elit et vulputate",
        "verandah vitae elit quis mauris porta voluptat",
      ],
      timestamp: basicOrder.timestamp || "3 mins ago",
    };
  };

  const mockOrderData = {
    id: "N2345678",
    type: "Dine in",
    customer: {
      name: "Lola Toriola",
      phone: "+44 20 7123 4567",
      tableNumber: "Table 4",
    },
    items: [
      {
        id: 1,
        name: "Abula",
        description: "A bowl of Amala, meat, Pepper, Ewedu",
        price: 12.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop&crop=face",
      },
      {
        id: 2,
        name: "Semo",
        description: "A bowl of Semo, Chicken, Fish",
        price: 12.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop&crop=center",
      },
      {
        id: 3,
        name: "Jollof Rice",
        description: "Bowl of Jollof rice, Chicken and Fish",
        price: 12.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1604329760661-e71dc83f8385?w=80&h=80&fit=crop&crop=center",
      },
    ],
    specialNotes: [
      "uncontacted tempor fauchibus lorem bibendum",
      "efficitur lacus lorem elit et vulputate",
      "verandah vitae elit quis mauris porta voluptat",
    ],
    timestamp: "3 mins ago",
  };

  const data =
    orderData && Array.isArray(orderData?.items)
      ? orderData
      : orderData
        ? createDetailedOrderData(orderData)
        : mockOrderData;

  const totalAmount = data?.items
    ? data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const handleMarkAsPreparing = () => {
    onMarkAsPreparing?.(data);
    onClose();
  };

  const handleMarkAsReady = () => {
    onMarkAsReady?.(data);
    onClose();
  };

  const handleCancel = () => {
    onCancel?.(data);
    onClose();
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={!!orderData}
      width={400}
      styles={{
        body: { padding: 0 },
      }}
      title={null}
    >
      {data && (
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <span className="m-3 block text-right text-sm text-gray-500">{data.timestamp}</span>
          <div className="border-b border-gray-100 p-6 text-center">
            <Avatar
              size={80}
              style={{ borderRadius: "99px", backgroundColor: "#fb923c", marginBottom: "16px" }}
            >
              <span className="text-lg font-semibold text-white">T1</span>
            </Avatar>
            <h2 className="text-primary mb-2 text-2xl font-semibold">{data.id}</h2>
            <div className="mt-3">
              <Tag
                color={data.type === "Pickup" ? "green" : "blue"}
                style={{ borderRadius: "20px", padding: "2px 30px" }}
              >
                {data.type}
              </Tag>
            </div>
          </div>

          <div className="p-6">
            <Collapse
              activeKey={activeKey}
              onChange={setActiveKey}
              ghost
              expandIconPosition="end"
              expandIcon={({ isActive }) =>
                isActive ? (
                  <ArrowUp01Icon size={18} className="text-primary" />
                ) : (
                  <ArrowDown01Icon size={18} className="text-primary" />
                )
              }
            >
              <Panel header="Customer Information" key="1">
                <div className="space-y-3">
                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Name:</span>
                    <span className="text-secondary font-semibold">
                      {data.customer?.name || "Unknown Customer"}
                    </span>
                  </div>

                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Phone:</span>
                    <span className="text-secondary font-semibold">
                      {data.customer?.phone || "N/A"}
                    </span>
                  </div>

                  <div className="flex w-full justify-between">
                    <span className="text-gray-900">Table:</span>
                    <span className="text-secondary font-semibold">
                      {data.customer?.tableNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>

          <Divider style={{ margin: "0 24px" }} />

          <div className="p-4">
            <div className="space-y-3">
              {data.items?.map((item) => (
                <div
                  key={item.id}
                  className="border-primary flex items-center gap-3 rounded-xl border p-3"
                >
                  <Avatar
                    size={60}
                    src={item.image}
                    style={{ borderRadius: "99px" }}
                    className="flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="truncate font-medium text-gray-800">{item.name}</h4>
                      {item.quantity > 1 && (
                        <span className="ml-2 text-xs text-gray-500">x{item.quantity}</span>
                      )}
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        £{item.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ margin: "0 24px" }} />

          {data.specialNotes && data.specialNotes.length > 0 && (
            <>
              <div className="p-6">
                <h3 className="mb-3 text-base font-medium text-gray-800">Special Notes</h3>
                <ul className="space-y-2 bg-gray-100 p-4">
                  {data.specialNotes.map((note, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Divider style={{ margin: "0 24px" }} />
            </>
          )}

          <div className="p-6">
            <h3 className="mb-3 text-base font-medium text-gray-800">Add Items</h3>
            <div className="flex flex-wrap gap-2">
              {["Tuo Fish", "Porla Fish", "Chicken"].map((item) => (
                <Tag
                  key={item}
                  color="#C3F4C9"
                  style={{
                    borderRadius: "20px",
                    padding: "6px 15px",
                    cursor: "pointer",
                    color: "#16a34a",
                  }}
                  className="transition-colors hover:bg-green-200"
                >
                  {item}
                </Tag>
              ))}
            </div>
          </div>

          <Divider style={{ margin: "0 24px" }} />

          <div className="p-6">
            <div className="mb-6 flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">£{totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                block
                onClick={handleMarkAsPreparing}
                style={{
                  backgroundColor: "#1F5226",
                  borderColor: "#16a34a",
                  borderRadius: "5px",
                  height: "48px",
                  fontWeight: "600",
                }}
              >
                Mark as Preparing
              </Button>

              <Button
                size="large"
                block
                onClick={handleMarkAsReady}
                style={{
                  borderColor: "#000000",
                  color: "#1F5226",
                  borderRadius: "5px",
                  height: "48px",
                  fontWeight: "600",
                }}
              >
                Mark as Ready
              </Button>

              <Button
                size="large"
                block
                onClick={handleCancel}
                danger
                ghost
                style={{
                  borderRadius: "5px",
                  height: "48px",
                  fontWeight: "600",
                }}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default PendingOrderDrawer;
