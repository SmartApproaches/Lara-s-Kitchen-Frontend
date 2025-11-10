import { Card } from "antd";

const StatCard = ({ icons, title, quantity, isActive, onClick }) => {
  return (
    <Card
      className={`flex cursor-pointer flex-col gap-2 rounded-md px-2 py-1 transition-all ${
        isActive ? "!bg-[#C3F4C9] shadow-md" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <img src={icons} alt="icons" className="h-10 w-10" />
      <h3 className="text-base font-semibold text-black">{title}</h3>
      <p className="text-xs text-black">{quantity}</p>
    </Card>
  );
};

export default StatCard;
