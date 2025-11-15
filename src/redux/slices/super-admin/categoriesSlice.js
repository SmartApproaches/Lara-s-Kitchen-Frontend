import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { axiosAuth } from "../../api/axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  category: null,
  categoryLoading: false,
  categoryError: null,

  subCategory: {},
  subCategoryLoading: false,
  subCategoryError: null,
};

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosAuth.get(`${BASE_URL}/admin/catalogue/menu-categories`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch categories");
    }
  },
);

export const getSubCategories = createAsyncThunk(
  "categories/getSubCategories",
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await axiosAuth.get(
        `${BASE_URL}/admin/catalogue/menu-categories/${categoryId}/subcategories`,
      );
      return { [categoryId]: data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch subcategories");
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoriesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.category = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
        toast.error("Failed to fetch categories");
      })

      .addCase(getSubCategories.pending, (state) => {
        state.subCategoryLoading = true;
        state.subCategoryError = null;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.subCategoryLoading = false;
        state.subCategory = { ...state.subCategory, ...action.payload };
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.subCategoryLoading = false;
        state.subCategoryError = action.payload;
        toast.error("Failed to fetch sub-categories");
      });
  },
});

export const { resetCategoriesState } = categoriesSlice.actions;
export default categoriesSlice;
