import { Card, Row, Col, Switch, Skeleton } from "antd";

const MenuCard = ({ items, onToggle, updatingId, isSkeleton }) => {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item, index) => {
        const available = item?.availability === "in_stock";
        const isUpdating = updatingId === item?.id; // ✅ Only disable this switch

        return (
          <Col key={item?.id || index} xs={24} sm={12} md={8}>
            <Card
              hoverable={!isSkeleton}
              style={{
                borderRadius: "12px",
                border: "1px solid #f0f0f0",
              }}
              bodyStyle={{ padding: "12px" }}
              className="flex flex-col !bg-[#F7F7F7]"
            >
              <div className="flex gap-3">
                {isSkeleton ? (
                  <Skeleton.Avatar active size={96} shape="circle" />
                ) : (
                  <img
                    src={item.media?.url}
                    alt={item.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                )}

                <div className="flex flex-1 flex-col justify-between">
                  {isSkeleton ? (
                    <>
                      <Skeleton.Input active size="small" style={{ width: 120 }} />
                      <Skeleton.Input active size="small" style={{ width: 150, marginTop: 6 }} />
                    </>
                  ) : (
                    <>
                      <h4 className="text-primary text-xl font-bold">{item.name}</h4>
                      <p className="text-primary text-sm">{item.description}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                {isSkeleton ? (
                  <Skeleton.Input active size="small" style={{ width: 50 }} />
                ) : (
                  <span className="font-semibold text-green-700">£{item.base_price}</span>
                )}

                {!isSkeleton && (
                  <Switch
                    checked={available}
                    onChange={(checked) => onToggle(item.id, checked)}
                    checkedChildren=""
                    unCheckedChildren=""
                    loading={isUpdating} // ✅ Only show loader on this one
                    disabled={isUpdating} // ✅ Prevent double-click
                    style={{
                      backgroundColor: available ? "#195B38" : "#ff4d4f",
                    }}
                  />
                )}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default MenuCard;
