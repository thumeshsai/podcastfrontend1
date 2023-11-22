// categoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    trending: {
      data: [],
      isFetched: false,
      index: 0,
    },
    latest: {
      data: [],
      isFetched: false,
      index: 0,
    },
    // Add other category initial states as needed
  },
  reducers: {
    setTrending: (state, action) => {
      state.trending.data = action.payload;
      state.trending.isFetched = true;
    },
    setLatest: (state, action) => {
      state.latest.data = action.payload;
      state.latest.isFetched = true;
    },
    addCategory: (state, action) => {
      // Assuming action.payload is an object representing a new category
      const { key, value } = action.payload;
      state[key] = { data: value, isFetched: true };
    },
    updateIndex: (state, action) => {
      const { categoryKey, newIndex } = action.payload;
      if (state[categoryKey]) {
        state[categoryKey].index = newIndex;
      }
    },
    // Add other category reducers as needed
  },
});

export const { setTrending, setLatest, addCategory, updateIndex } =
  categoriesSlice.actions;

// Selectors
export const selectCategories = (state) => state.categories;

// Thunk actions
export const fetchTrendingAndLatestAsync = () => async (dispatch, getState) => {
  try {
    // Check if the data is already fetched
    const { trending, latest } = getState().categories;
    if (!trending.isFetched) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const trendingResponse = await fetch(
        `${backendUrl}/categories/Trending`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const trendingData = await trendingResponse.json();
      dispatch(setTrending(trendingData));
    }

    if (!latest.isFetched) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const latestResponse = await fetch(`${backendUrl}/categories/Latest`, {
        method: "GET",
        credentials: "include",
      });
      const latestData = await latestResponse.json();
      dispatch(setLatest(latestData));
    }
  } catch (error) {
    console.error("Error fetching trending and latest data:", error);
  }
};

export const fetchCategoryAsync =
  (categoryKey) => async (dispatch, getState) => {
    try {
      // Check if the data is already fetched
      const category = getState().categories[categoryKey];
      if (!category || !category.isFetched) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/categories/${categoryKey}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const categoryData = await response.json();
        dispatch(
          addCategory({ key: categoryKey, value: categoryData, index: 0 })
        );
      }
    } catch (error) {
      console.error(`Error fetching ${categoryKey} category data:`, error);
    }
  };

// Action creators
export const useFetchTrendingAndLatest = () => {
  const dispatch = useDispatch();
  return () => dispatch(fetchTrendingAndLatestAsync());
};

export const useFetchCategory = (categoryKey) => {
  const dispatch = useDispatch();
  return () => dispatch(fetchCategoryAsync(categoryKey));
};

export const useUpdateIndex = (categoryKey ,newIndex) => {
  const dispatch = useDispatch();
  dispatch(updateIndex({ categoryKey, newIndex}));
};

export const useCategoriesSelector = () => useSelector(selectCategories);

export default categoriesSlice.reducer;
