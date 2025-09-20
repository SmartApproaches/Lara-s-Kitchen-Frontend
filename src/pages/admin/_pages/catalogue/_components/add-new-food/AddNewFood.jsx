import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft02Icon } from "hugeicons-react";
import { Button, Row, Col, Typography, message, Spin } from "antd";
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
  description: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value)),
  basePrice: yup
    .number()
    .typeError("Base price must be a number")
    .required("Base price is required")
    .min(0, "Price must be positive"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .min(0, "Discount must be positive")
    .max(100, "Discount cannot exceed 100%")
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value)),
  stockAvailability: yup.string().required("Stock availability is required"),
  calorieSize: yup
    .number()
    .typeError("Calories must be a number")
    .min(0, "Calories must be positive"),
  preparationTime: yup
    .number()
    .typeError("Preparation time must be a number")
    .min(1, "Preparation time must be at least 1 minute"),
  portionSizes: yup.object().shape({
    small: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Small portion price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    medium: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Medium portion price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    large: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Large portion price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
  }),
  addOns: yup.object().shape({
    drinks: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Drinks add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    extraProteins: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Extra proteins add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    sideDish: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Side dish add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
  }),
});

const step0Schema = yup.object().shape({
  itemName: yup.string().required("Item name is required"),
  category: yup.string().required("Category is required"),
  basePrice: yup
    .number()
    .typeError("Base price must be a number")
    .required("Base price is required")
    .min(0, "Price must be positive"),
  stockAvailability: yup.string().required("Stock availability is required"),
});

const step1Schema = yup.object().shape({
  preparationTime: yup
    .number()
    .required("Preparation time is required")
    .min(1, "Preparation time must be at least 1 minute"),
  portionSizes: yup
    .object()
    .test("at-least-one-portion", "At least one portion size must be enabled", function (value) {
      return value.small.enabled || value.medium.enabled || value.large.enabled;
    })
    .shape({
      small: yup.object().shape({
        enabled: yup.boolean(),
        price: yup.mixed().when("enabled", {
          is: true,
          then: () =>
            yup
              .number()
              .typeError("Price must be a number")
              .required("Small portion price is required")
              .min(0, "Price must be positive"),
          otherwise: () => yup.mixed().notRequired(),
        }),
      }),
      medium: yup.object().shape({
        enabled: yup.boolean(),
        price: yup.mixed().when("enabled", {
          is: true,
          then: () =>
            yup
              .number()
              .typeError("Price must be a number")
              .required("Medium portion price is required")
              .min(0, "Price must be positive"),
          otherwise: () => yup.mixed().notRequired(),
        }),
      }),
      large: yup.object().shape({
        enabled: yup.boolean(),
        price: yup.mixed().when("enabled", {
          is: true,
          then: () =>
            yup
              .number()
              .typeError("Price must be a number")
              .required("Large portion price is required")
              .min(0, "Price must be positive"),
          otherwise: () => yup.mixed().notRequired(),
        }),
      }),
    }),
  addOns: yup.object().shape({
    drinks: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Drinks add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    extraProteins: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Extra proteins add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
    sideDish: yup.object().shape({
      enabled: yup.boolean(),
      price: yup.mixed().when("enabled", {
        is: true,
        then: () =>
          yup
            .number()
            .typeError("Price must be a number")
            .required("Side dish add-on price is required")
            .min(0, "Price must be positive"),
        otherwise: () => yup.mixed().notRequired(),
      }),
    }),
  }),
});

const ImageUploadAndCustomizationsStep = ({ control, watch, uploadedImage, setUploadedImage }) => {
  return (
    <div className="space-y-8">
      <ImageUploadStep
        control={control}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
      />
      <CustomizationsStep control={control} watch={watch} />
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
      description: "",
      basePrice: "",
      discount: "",
      stockAvailability: "",
      calorieSize: "",
      preparationTime: 15,
      portionSizes: {
        small: { enabled: true, price: 10 },
        medium: { enabled: true, price: 10 },
        large: { enabled: false, price: "" },
      },
      addOns: {
        drinks: { enabled: true, price: 10 },
        extraProteins: { enabled: true, price: 10 },
        sideDish: { enabled: false, price: "" },
      },
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
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
        itemName: catalogueItem.itemName || catalogueItem.name || "",
        category: catalogueItem.category || "",
        description: catalogueItem.description || "",
        basePrice: catalogueItem.basePrice || catalogueItem.price || "",
        discount: catalogueItem.discount || "",
        stockAvailability: catalogueItem.stockAvailability || catalogueItem.availability || "",
        calorieSize: catalogueItem.calorieSize || catalogueItem.calories || "",
        preparationTime: catalogueItem.preparationTime || 15,
        portionSizes: catalogueItem.portionSizes
          ? typeof catalogueItem.portionSizes === "string"
            ? JSON.parse(catalogueItem.portionSizes)
            : catalogueItem.portionSizes
          : defaultValues.portionSizes,
        addOns: catalogueItem.addOns
          ? typeof catalogueItem.addOns === "string"
            ? JSON.parse(catalogueItem.addOns)
            : catalogueItem.addOns
          : defaultValues.addOns,
      };

      reset(formData);

      if (catalogueItem.image) {
        setUploadedImage(catalogueItem.image);
      }

      setIsFormInitialized(true);
    }
  }, [catalogueItem, isEditMode, reset, isFormInitialized, defaultValues]);

  const steps = [
    {
      title: "Basic Information",
      content: <BasicInfoStep control={control} errors={errors} />,
    },
    {
      title: "Image Upload & Customizations",
      content: (
        <ImageUploadAndCustomizationsStep
          control={control}
          watch={watch}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      ),
    },
  ];

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("category", data.category);
    if (data?.description) {
      formData.append("description", data.description);
    }
    formData.append("basePrice", data.basePrice);
    if (data?.discount) {
      formData.append("discount", data.discount || 0);
    }
    formData.append("stockAvailability", data.stockAvailability);
    formData.append("calorieSize", data.calorieSize || 0);
    formData.append("preparationTime", data.preparationTime);
    formData.append("portionSizes", JSON.stringify(data.portionSizes));
    formData.append("addOns", JSON.stringify(data.addOns));

    if (uploadedImage && typeof uploadedImage !== "string") {
      formData.append("image", uploadedImage);
    }

    try {
      if (isEditMode) {
        await editCatalogueItem({ id: catalogueId, formData }).unwrap();
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
        error?.data?.message ||
        (isEditMode ? "Failed to update food item." : "Failed to publish food item.");
      toast.error(errorMessage);
    }
  };

  const handlePublish = async () => {
    const isValid = await trigger();
    if (isValid) {
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
        await step0Schema.validate(currentValues, { abortEarly: false });
        return true;
      } else if (currentStep === 1) {
        await step1Schema.validate(currentValues, { abortEarly: false });
        return true;
      }
      return true;
    } catch (validationError) {
      if (validationError.errors && validationError.errors.length > 0) {
        validationError.errors.forEach((error) => {
          customInfoToast(error);
        });
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
      message.success("Step completed successfully!");
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
          itemName: catalogueItem.itemName || catalogueItem.name || "",
          category: catalogueItem.category || "",
          description: catalogueItem.description || "",
          basePrice: catalogueItem.basePrice || catalogueItem.price || "",
          discount: catalogueItem.discount || "",
          stockAvailability: catalogueItem.stockAvailability || catalogueItem.availability || "",
          calorieSize: catalogueItem.calorieSize || catalogueItem.calories || "",
          preparationTime: catalogueItem.preparationTime || 15,
          portionSizes: catalogueItem.portionSizes
            ? typeof catalogueItem.portionSizes === "string"
              ? JSON.parse(catalogueItem.portionSizes)
              : catalogueItem.portionSizes
            : defaultValues.portionSizes,
          addOns: catalogueItem.addOns
            ? typeof catalogueItem.addOns === "string"
              ? JSON.parse(catalogueItem.addOns)
              : catalogueItem.addOns
            : defaultValues.addOns,
        };
        reset(formData);
        setUploadedImage(catalogueItem.image || null);
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
