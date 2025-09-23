import { useState } from "react";
import { Card, Skeleton, Alert, Avatar, Tag } from "antd";
import { CallRinging02Icon, Mail01Icon } from "hugeicons-react";

import CustomerDetailsDrawer from "./CustomerDetailsDrawer";
import { IMAGES } from "../../../../../constants";

const CustomersCards = ({ customers, isLoading, isError }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  if (isLoading) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (isError) return <Alert type="error" message="Failed to load customers" />;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers?.length ? (
          customers.map((cust) => (
            <Card
              key={cust?.id}
              hoverable
              onClick={() => setSelectedCustomer(cust)}
              style={{ borderRadius: "13px", transitionProperty: "all" }}
              className="transform cursor-pointer rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-start gap-2 md:gap-4 sm:flex-row sm:items-center">
                <Avatar
                  style={{ borderRadius: "13px" }}
                  size={80}
                  src={cust?.avatar}
                  className="flex-shrink-0 rounded-lg"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-primary truncate text-lg font-bold sm:text-lg md:text-xl">
                    {cust?.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 truncate text-base font-medium text-green-600">
                    <Mail01Icon size={18} />
                    <span className="truncate">{cust?.email}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 truncate text-base font-medium text-green-600">
                    <CallRinging02Icon fill="currentColor" size={18} />
                    <span className="truncate">{cust?.phone}</span>
                  </div>

                  <Tag
                    color="default"
                    style={{
                      marginTop: "8px",
                      fontSize: "13px",
                      borderRadius: "20px",
                      padding: "3px 10px",
                    }}
                    className="mt-2"
                  >
                    {cust?.orders} orders
                  </Tag>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 mt-20 flex flex-col items-center justify-center gap-4 text-center text-lg text-[#1E872C]">
            <img src={IMAGES.emptyState} alt="No Customers" className="h-40 w-40" />
            <h3 className="text-xl font-semibold md:text-2xl">No Customers Found</h3>
            <p>Customers will appear here once they place an order</p>
          </div>
        )}
      </div>

      <CustomerDetailsDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  );
};

export default CustomersCards;
