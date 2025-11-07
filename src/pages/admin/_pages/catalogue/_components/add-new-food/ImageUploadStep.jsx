import React, { useRef, useState, useEffect } from "react";
import { Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CheckmarkCircle02Icon } from "hugeicons-react";

const ImageUploadStep = ({ uploadedImage, setUploadedImage }) => {
  const fileInputRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (uploadedImage) {
      if (typeof uploadedImage === "string") {
        setPreviewUrl(uploadedImage);
        setImageName("Current image");
      } else if (uploadedImage instanceof File) {
        const objectUrl = URL.createObjectURL(uploadedImage);
        setPreviewUrl(objectUrl);
        setImageName(uploadedImage.name);

        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewUrl(null);
      setImageName("");
    }
  }, [uploadedImage]);

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB");
      return;
    }

    setUploadedImage(file);
    setImageName(file.name);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setUploadedImage(null);
    setImageName("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h3 className="text-lg font-medium text-[#232323] md:text-xl">Image Upload</h3>
        <div
          className="mt-5 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-green-500 hover:bg-gray-100"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="flex flex-col items-center gap-4 lg:flex-row">
                <Image
                  src={previewUrl}
                  alt={imageName}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                  preview={true}
                />
                <div className="flex items-center justify-center gap-1 text-sm md:text-base">
                  <p className="max-w-[150px] truncate text-left md:max-w-[300px]">{imageName}</p>
                  <CheckmarkCircle02Icon fill="#0CA921" color="#fff" className="ml-2 shrink-0" />
                </div>
              </div>
              <Button type="text" danger onClick={handleRemoveImage} className="shrink-0">
                Remove
              </Button>
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
                Image of food or drink item (Max 25MB)
              </span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
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
