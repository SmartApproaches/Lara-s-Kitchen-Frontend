import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button, Image, Modal, Slider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02 } from "@hugeicons/core-free-icons";
import Cropper from "react-easy-crop";

import { getCroppedImg } from "../../../../../../utils/cropImage";
import { customWarningToast } from "../../../../../../utils/toast";

const ImageUploadStep = ({ uploadedImage, setUploadedImage }) => {
  const fileInputRef = useRef(null);
  const isCroppingRef = useRef(false);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    try {
      isCroppingRef.current = false;

      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }

      const croppedImage = await getCroppedImg(tempImageUrl, croppedAreaPixels, rotation);

      const file = new File([croppedImage], imageName, {
        type: "image/jpeg",
      });

      setUploadedImage(file);
      setShowCropModal(false);
      setTempImageUrl(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } catch (e) {
      customWarningToast("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    isCroppingRef.current = false;

    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    if (rotationTimeoutRef.current) {
      clearTimeout(rotationTimeoutRef.current);
    }

    setShowCropModal(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    if (uploadedImage && isSubscribed) {
      if (typeof uploadedImage === "string") {
        setPreviewUrl(uploadedImage);
        setImageName("Current image");
      } else if (uploadedImage instanceof File) {
        const objectUrl = URL.createObjectURL(uploadedImage);
        setPreviewUrl(objectUrl);
        setImageName(uploadedImage.name);

        return () => {
          isSubscribed = false;
          URL.revokeObjectURL(objectUrl);
        };
      }
    } else if (isSubscribed) {
      setPreviewUrl(null);
      setImageName("");
    }

    return () => {
      isSubscribed = false;
    };
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

    const objectUrl = URL.createObjectURL(file);
    setTempImageUrl(objectUrl);
    setImageName(file.name);
    isCroppingRef.current = true;
    setShowCropModal(true);
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

  const zoomTimeoutRef = useRef(null);
  const rotationTimeoutRef = useRef(null);

  const handleZoomChange = useCallback((value) => {
    if (isCroppingRef.current) {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      zoomTimeoutRef.current = setTimeout(() => {
        setZoom(value);
      }, 16);
    }
  }, []);

  const handleRotationChange = useCallback((value) => {
    if (isCroppingRef.current) {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
      rotationTimeoutRef.current = setTimeout(() => {
        setRotation(value);
      }, 20);
    }
  }, []);

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
                  <HugeiconsIcon icon={CheckmarkCircle02} fill="#0CA921" color="#fff" className="ml-2 shrink-0" />
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

      <Modal
        title="Crop Image"
        open={showCropModal}
        onCancel={handleCropCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCropCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleCropConfirm}>
            Crop & Save
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="relative h-[400px] w-full bg-gray-900">
            {tempImageUrl && (
              <Cropper
                image={tempImageUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Zoom</label>
              <Slider min={1} max={3} step={0.1} value={zoom} onChange={handleZoomChange} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Rotation</label>
              <Slider min={0} max={360} step={1} value={rotation} onChange={handleRotationChange} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageUploadStep;
