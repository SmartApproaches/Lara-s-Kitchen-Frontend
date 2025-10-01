import React from "react";
import { Card } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { IMAGES } from "../../../../constants";

const events = [
  {
    id: 1,
    title: "Live Music Fridays",
    date: "Oct 02, 2025",
    time: "12 noon",
    image: IMAGES.resturantImage,
  },
  {
    id: 2,
    title: "Live Music Fridays",
    date: "Oct 02, 2025",
    time: "12 noon",
    image: IMAGES.resturantImage,
  },
  {
    id: 3,
    title: "Live Music Fridays",
    date: "Oct 02, 2025",
    time: "12 noon",
    image: IMAGES.resturantImage,
  },
  {
    id: 4,
    title: "Live Music Fridays",
    date: "Oct 02, 2025",
    time: "12 noon",
    image: IMAGES.resturantImage,
  },
];

const UpcomingEventSection = () => {
  return (
    <div className="bg-white px-4 py-12">
      <h3 className="mb-10 text-center text-3xl font-bold text-green-900 md:text-4xl">
        Upcoming event
      </h3>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className="!rounded-2xl border-0 !bg-[#F7F7F7] p-4"
            bodyStyle={{ padding: "16px 16px" }}
          >
            {/* Image container with border + rounded corners */}
            <div className="overflow-hidden rounded-2xl border-4 border-green-900">
              <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
            </div>

            {/* Title */}
            <h4 className="mt-4 mb-2 text-center text-lg font-medium text-gray-800">
              {event.title}
            </h4>

            {/* Date & Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <CalendarOutlined />
                <span>{event.date}</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-600">
                <ClockCircleOutlined />
                <span>{event.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventSection;
