import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft02Icon } from "hugeicons-react";
import { Button, Row, Col, Typography, Spin } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button as CustomButton } from "../../../../../../components";
import { customInfoToast } from "../../../../../../utils/toast";
import ProgressTracker from "./ProgressTracker";
import ImageUploadStep from "./ImageUploadStep";
import CustomizationsStep from "./CustomizationStep";
import PreviewPanel from "./PreviewPanel";
import BasicInfoStep from "./BasicInfoStep";
import {
  useAddCatalogueItemMutation,
  useEditCatalogueItemMutation,
  useGetCatalogueItemQuery,
} from "../../../../../../redux/slices/super-admin/catalogueApiSlice";

const { Title } = Typography;

const schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  category: yup.string().required("Category is required"),
  subcategoryId: yup.string().required("Sub category is required"),
  typeOfMeal: yup.string().required("Type of meal is required"),
  description: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value)),
  menu_sizes: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Size is required"),
        price: yup
          .number()
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price must be positive"),
      }),
    )
    .min(1, "At least one size with price is required"),
  stockAvailability: yup.string().required("Stock availability is required"),
  calorieSize: yup
    .number()
    .typeError("Calories must be a number")
    .required("Calorie size is required")
    .min(0, "Calories must be positive"),
  preparationTime: yup
    .number()
    .typeError("Preparation time must be a number")
    .required("Preparation time is required")
    .min(1, "Preparation time must be at least 1 minute"),
});

const step0Schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  category: yup.string().required("Category is required"),
  subcategoryId: yup.string().required("Sub category is required"),
  typeOfMeal: yup.string().required("Type of meal is required"),
});

const step1Schema = yup.object().shape({
  calorieSize: yup
    .number()
    .typeError("Calories must be a number")
    .required("Calorie size is required")
    .min(0, "Calories must be positive"),
  preparationTime: yup
    .number()
    .typeError("Preparation time must be a number")
    .required("Preparation time is required")
    .min(1, "Preparation time must be at least 1 minute"),
  menu_sizes: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Size is required"),
        price: yup
          .number()
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price must be positive"),
      }),
    )
    .min(1, "At least one size with price is required"),
  stockAvailability: yup.string().required("Stock availability is required"),
});

const ImageUploadAndCustomizationsStep = ({
  control,
  setValue,
  watch,
  uploadedImage,
  setUploadedImage,
  errors,
}) => {
  return (
    <div className="space-y-8">
      <ImageUploadStep
        control={control}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
      />
      <CustomizationsStep setValue={setValue} watch={watch} control={control} errors={errors} />
    </div>
  );
};

const AddNewFood = () => {
  const { catalogueId } = useParams();
  const isEditMode = Boolean(catalogueId);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [addCatalogueItem, { isLoading: isAddingCatalogueItem, error: catalogueError }] =
    useAddCatalogueItemMutation();
  const {
    data: catalogueItemResponse,
    isLoading: isLoadingCatalogueItem,
    error: loadError,
  } = useGetCatalogueItemQuery(catalogueId, {
    skip: !isEditMode,
  });
  const [editCatalogueItem, { isLoading: isEditingCatalogueItem, error: editError }] =
    useEditCatalogueItemMutation();

  const catalogueItem = catalogueItemResponse?.data;

  const defaultValues = useMemo(
    () => ({
      itemName: "",
      category: "",
      subcategoryId: "",
      typeOfMeal: "normal",
      description: "",
      menu_sizes: [{ name: "large", price: "" }],
      stockAvailability: "",
      calorieSize: 0,
      preparationTime: 15,
    }),
    [],
  );

  const {
    control,
    watch,
    reset,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isEditMode && catalogueItem && !isFormInitialized) {
      const formData = {
        itemName: catalogueItem?.name || "",
        category: catalogueItem?.category_id || "",
        subcategoryId: catalogueItem?.subcategory_id || "",
        description: catalogueItem?.description || "",
        menu_sizes: catalogueItem?.sizes.map((size) => ({
          name: size?.name || "",
          price: size?.price || "",
        })),
        typeOfMeal: catalogueItem?.menu_type || "normal",
        stockAvailability: catalogueItem?.availability || "",
        calorieSize: catalogueItem?.calorie_size || 0,
        preparationTime: catalogueItem?.preparation_time
          ? parseInt(catalogueItem?.preparation_time.replace(/\D/g, ""))
          : "",
      };

      reset(formData);

      if (catalogueItem.media?.url) {
        setUploadedImage(catalogueItem.media.url);
      }

      setIsFormInitialized(true);
    }
  }, [catalogueItem, isEditMode, reset, isFormInitialized, defaultValues]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    let hasChanges = false;

    const processedMenuSizes = data.menu_sizes.map((item) => ({
      name: item.name,
      price: Number(item.price),
    }));

    if (isEditMode && catalogueItem) {
      const originalMenuSizes =
        catalogueItem.sizes?.map((size) => ({
          name: size?.name || "",
          price: Number(size?.price) || 0,
        })) || [];

      if (data.itemName !== catalogueItem.name) {
        formData.append("menu_name", data.itemName);
        hasChanges = true;
      }
      if (data.category !== catalogueItem.category_id) {
        formData.append("category_id", data.category);
        hasChanges = true;
      }
      if (data.subcategoryId !== catalogueItem.subcategory_id) {
        formData.append("subcategory_id", data.subcategoryId);
        hasChanges = true;
      }
      if (data.typeOfMeal !== catalogueItem.menu_type) {
        formData.append("menu_type", data.typeOfMeal);
        hasChanges = true;
      }

      const currentDescription = data.description || "";
      const originalDescription = catalogueItem.description || "";
      if (currentDescription !== originalDescription) {
        formData.append("menu_description", data.description || "");
        hasChanges = true;
      }

      if (String(data.stockAvailability) !== String(catalogueItem.availability)) {
        formData.append("availability", data.stockAvailability);
        hasChanges = true;
      }

      if (Number(data.calorieSize || 0) !== Number(catalogueItem.calorie_size || 0)) {
        formData.append("calorie_size", data.calorieSize || 0);
        hasChanges = true;
      }

      const originalPrepTime = catalogueItem.preparation_time
        ? parseInt(catalogueItem.preparation_time.replace(/\D/g, ""))
        : null;
      if (Number(data.preparationTime) !== Number(originalPrepTime)) {
        formData.append("preparation_time", `${data.preparationTime}m`);
        hasChanges = true;
      }

      if (uploadedImage && uploadedImage instanceof File) {
        formData.append("file", uploadedImage);
        hasChanges = true;
      }

      if (JSON.stringify(processedMenuSizes) !== JSON.stringify(originalMenuSizes)) {
        formData.append("menu_sizes", JSON.stringify(processedMenuSizes));
        hasChanges = true;
      }

      if (!hasChanges) {
        customInfoToast("No changes detected. Please modify at least one field.");
        return;
      }
    } else {
      formData.append("menu_name", data.itemName);
      formData.append("category_id", data.category);
      formData.append("subcategory_id", data.subcategoryId);
      formData.append("menu_type", data.typeOfMeal);

      if (data?.description) {
        formData.append("menu_description", data.description);
      }

      formData.append("menu_sizes", JSON.stringify(processedMenuSizes));

      formData.append("availability", data.stockAvailability);
      formData.append("calorie_size", data.calorieSize || 0);
      formData.append("preparation_time", `${data.preparationTime}m`);

      if (uploadedImage && uploadedImage instanceof File) {
        formData.append("file", uploadedImage);
      }
    }

    try {
      if (isEditMode) {
        await editCatalogueItem({ id: catalogueId, data: formData }).unwrap();
        toast.success("Food item updated successfully!");
      } else {
        await addCatalogueItem(formData).unwrap();
        toast.success("Food item published successfully!");
        reset(defaultValues);
        setUploadedImage(null);
        setCurrentStep(0);
      }
    } catch (error) {
      const errorMessage =
        typeof error?.data?.message === "string"
          ? error.data.message
          : isEditMode
            ? "Failed to update food item."
            : "Failed to publish food item.";
      toast.error(errorMessage);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      content: <BasicInfoStep control={control} errors={errors} setValue={setValue} />,
    },
    {
      title: "Image Upload & Customizations",
      content: (
        <ImageUploadAndCustomizationsStep
          control={control}
          setValue={setValue}
          watch={watch}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          errors={errors}
        />
      ),
    },
  ];

  const handlePublish = async () => {
    const isValid = await trigger();

    if (isValid) {
      if (!isEditMode && !uploadedImage) {
        customInfoToast("Please upload an image");
        return;
      }

      const formData = getValues();
      onSubmit(formData);
    } else {
      customInfoToast("Please fill in all required fields before publishing.");
    }
  };

  const validateCurrentStep = async () => {
    const currentValues = getValues();

    try {
      if (currentStep === 0) {
        await step0Schema.validate(currentValues, { abortEarly: true });
        return true;
      } else if (currentStep === 1) {
        await step1Schema.validate(currentValues, { abortEarly: true });

        if (!isEditMode && !uploadedImage) {
          customInfoToast("Please upload an image");
          return false;
        }

        return true;
      }
      return true;
    } catch (validationError) {
      if (validationError.message) {
        customInfoToast(validationError.message);
      } else {
        customInfoToast("Please fill in all required fields before proceeding.");
      }
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      if (catalogueItem) {
        const formData = {
          itemName: catalogueItem?.name || "",
          category: catalogueItem?.category_id || "",
          subcategoryId: catalogueItem?.subcategory_id || "",
          typeOfMeal: catalogueItem?.menu_type || "normal",
          description: catalogueItem?.description || "",
          menu_sizes: catalogueItem?.menu_sizes.map((size) => ({
            name: size?.name || "",
            price: size?.price || "",
          })),
          stockAvailability: catalogueItem?.availability || "",
          calorieSize: catalogueItem?.calorie_size || "",
          preparationTime: catalogueItem?.preparation_time
            ? parseInt(catalogueItem?.preparation_time.replace(/\D/g, ""))
            : 15,
        };
        reset(formData);
        setUploadedImage(catalogueItem?.media?.url || null);
      }
    } else {
      reset(defaultValues);
      setUploadedImage(null);
    }
    setCurrentStep(0);
  };

  useEffect(() => {
    if (catalogueError || editError || loadError) {
      const error = catalogueError || editError || loadError;
      const errorMessage = error?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  }, [catalogueError, editError, loadError]);

  if (isEditMode && isLoadingCatalogueItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F6F6]">
        <Spin size="large" />
      </div>
    );
  }

  if (isEditMode && loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F6F6]">
        <div className="text-center">
          <p className="mb-4 text-red-500">Failed to load catalogue item</p>
          <Link to="/admin/catalogue">
            <CustomButton size="lg" type="primary">
              Back to Catalogue
            </CustomButton>
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode ? "Edit Food Item" : "New Food Upload";
  const publishButtonText = isEditMode ? "Update" : "Publish";
  const isLoading = isEditMode ? isEditingCatalogueItem : isAddingCatalogueItem;

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <Row className="h-full">
        <Col xs={24} lg={14} className="border-r border-gray-200">
          <div className="h-full p-6">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/admin/catalogue" className="flex items-center gap-4">
                <ArrowLeft02Icon size={25} className="text-gray-600" />
                <h2 className="text-lg font-semibold md:text-xl lg:text-2xl">{pageTitle}</h2>
              </Link>
              <div className="flex gap-3">
                <CustomButton loading={isLoading} type="primary" onClick={handlePublish}>
                  {publishButtonText}
                </CustomButton>
                <CustomButton
                  className="border border-[#BE6464] bg-transparent text-[#BE6464] hover:bg-[#F9EAEA]"
                  onClick={handleCancel}
                >
                  Cancel
                </CustomButton>
              </div>
            </div>

            <ProgressTracker currentStep={currentStep} totalSteps={steps.length} />

            <div className="mb-8">{steps[currentStep].content}</div>

            <div className={`mt-4 flex justify-between`}>
              {currentStep > 0 && (
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="!border !border-green-700 !px-10 !text-green-700"
                >
                  Back
                </Button>
              )}

              {currentStep < steps.length - 1 && (
                <CustomButton
                  type="primary"
                  onClick={nextStep}
                  className="ml-auto border border-green-700 bg-transparent !px-10 text-[#0CA921] hover:text-white"
                >
                  Next
                </CustomButton>
              )}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10} className="lg-block hidden">
          <div className="bg-white p-6">
            <Title level={3} className="mb-4 text-center">
              Preview
            </Title>
            <PreviewPanel formData={watchedValues} uploadedImage={uploadedImage} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AddNewFood;
