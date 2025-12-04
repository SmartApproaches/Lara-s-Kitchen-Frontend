import React from "react";
import { Form, Input, Button } from "antd";

import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  InstagramIcon,
  NewTwitterIcon,
  Facebook01Icon,
  TiktokIcon,
} from "hugeicons-react";

const { TextArea } = Input;

const InquiryForm = () => {
  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div className="flex min-h-screen items-center bg-white px-4">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 py-28 md:grid-cols-2">
        {/* Left side - Form */}
        {/* <div className="animate-slide-in-left">
          <h2 className="text-primary animate-fade-in-down mb-6 text-3xl font-bold">
            Inquiry Form
          </h2>
          <Form layout="vertical" onFinish={onFinish} className="animate-fade-in-up">
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" size="large" className="!border-none !bg-[#F8F8F8]" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input
                placeholder="Email address"
                size="large"
                className="!border-none !bg-[#F8F8F8]"
              />
            </Form.Item>
            <Form.Item label="Title" name="title">
              <Input placeholder="Title" size="large" className="!border-none !bg-[#F8F8F8]" />
            </Form.Item>
            <Form.Item label="Message" name="message">
              <TextArea
                placeholder="Enter Message"
                rows={4}
                className="!border-none !bg-[#F8F8F8]"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="!hover:bg-green-800 animate-zoom-in !bg-green-700"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div> */}

        {/* Right side - Contact Info */}
        <div className="bg-primary animate-slide-in-right flex flex-col justify-center rounded-2xl p-8 text-white">
          <h3 className="animate-fade-in-down mb-6 text-center text-3xl font-bold">Get In Touch</h3>

          <div className="animate-fade-in-up space-y-6">
            <div className="flex items-center space-x-3 border-b border-green-700 pb-3">
              <Location01Icon className="text-lg" />
              <span className="text-2xl">233 5th Ave Ext, Johnstown NY 12095</span>
            </div>
            <div className="flex items-center space-x-3 border-b border-green-700 pb-3">
              <Call02Icon className="text-lg" />
              <span className="text-2xl">+447454822494, +441915434197</span>
            </div>
            <div className="flex items-center space-x-3 border-b border-green-700 pb-3">
              <Mail01Icon className="text-lg" />
              <span className="text-2xl">admin@laraskichen.org</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="animate-slide-in-bottom mt-8 flex justify-center space-x-6">
            {/* <a href="#" className="rounded-full bg-white p-3 text-green-900 hover:bg-green-100">
              <Facebook01Icon />
            </a> */}
            <a
              href="https://www.instagram.com/larakitchen_abulaspot/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white p-3 text-green-900 hover:bg-green-100"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.tiktok.com/@abula.spot?_t=ZN-90XtHy0CnQc&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white p-3 text-green-900 hover:bg-green-100"
            >
              <TiktokIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
