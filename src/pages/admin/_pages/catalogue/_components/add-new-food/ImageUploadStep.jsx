import React, { useRef, useState } from "react";
import { Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CheckmarkCircle02Icon } from "hugeicons-react";

const ImageUploadStep = ({ uploadedImage, setUploadedImage }) => {
  const fileInputRef = useRef(null);
  const [imageName, setImageName] = useState("");

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="text-lg font-medium text-[#232323] md:text-xl">Image Upload</h3>
        <div
          className="mt-5 cursor-pointer rounded-lg bg-gray-100 p-8 text-center transition-colors hover:border-green-500"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedImage ? (
            <div className="flex items-center justify-start gap-4">
              <Image
                src={uploadedImage}
                alt={imageName}
                width={60}
                height={60}
                className="rounded-full object-cover"
                preview={false}
              />
              <div className="flex items-center justify-center gap-1 text-sm md:text-base">
                <p>{imageName}</p>
                <CheckmarkCircle02Icon fill="#0CA921" color="#fff" className="ml-2" />
              </div>
            </div>
          ) : (
            <div>
              <UploadOutlined className="mb-4 text-4xl text-gray-400" />
              <div className="flex items-center justify-center gap-1 !text-[15px]">
                <span>Drag and drop or</span>
                <Button type="link" className="mb-[2px] -ml-3 !text-green-600">
                  click to upload
                </Button>
              </div>
              <span className="mt-2 block text-[15px] text-gray-500">
                Image or documents that would be helpful in explaining your brief here (Max 25MB)
              </span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ImageUploadStep;
