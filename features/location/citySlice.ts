import { createSlice } from "@reduxjs/toolkit";
import { createCity, updateCity, fetchCities, fetchCityById, deleteCity } from "./cityThunk";
import { CityInitialState } from "./cityModel";

const initialState: CityInitialState = {
    cities: [],
    singleCity: null,
    cityLoading: false,
    cityError: null,
}

const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state) => {
                state.cityLoading = true;
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.cityLoading = false;
                state.cityError = action.payload as string;
            })
            .addCase(fetchCityById.pending, (state) => {
                state.cityLoading = true;
            })
            .addCase(fetchCityById.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.singleCity = action.payload;
            })
            .addCase(fetchCityById.rejected, (state, action) => {
                state.cityLoading = false;
                state.cityError = action.payload as string;
            })
            .addCase(createCity.pending, (state) => {
                state.cityLoading = true;
            })
            .addCase(createCity.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.cities.push(action.payload);
            })
            .addCase(createCity.rejected, (state, action) => {
                state.cityLoading = false;
                state.cityError = action.payload as string;
            })
            .addCase(updateCity.pending, (state) => {
                state.cityLoading = true;
            })
            .addCase(updateCity.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.cities = state.cities.map((city) =>
                    city._id === action.payload._id ? action.payload : city
                );
            })
            .addCase(updateCity.rejected, (state, action) => {
                state.cityLoading = false;
                state.cityError = action.payload as string;
            })
            .addCase(deleteCity.pending, (state) => {
                state.cityLoading = true;
            })
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.cities = state.cities.filter((city) => city._id !== action.payload);
            })
            .addCase(deleteCity.rejected, (state, action) => {
                state.cityLoading = false;
                state.cityError = action.payload as string;
            })
    }
})

export default citySlice.reducer