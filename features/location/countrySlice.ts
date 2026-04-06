import { createSlice } from "@reduxjs/toolkit";
import { CountryInitialState } from "./countryModel";
import { ICountryResponse, ICountry } from "./countryModel";
import { fetchCountries, fetchCountryById, createCountry, updateCountry, deleteCountry } from "./countryThunk";

const initialState: CountryInitialState = {
    countries: [],
    singleCountry: null,
    loading: false,
    error: null,
    success: false,
}

const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //get All Countries
            .addCase(fetchCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //get Country by Id
            .addCase(fetchCountryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleCountry = action.payload;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //create Country
            .addCase(createCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries.push(action.payload);
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //update Country
            .addCase(updateCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload)
                state.countries = state.countries.map((country) =>
                    country._id === action.payload._id ? action.payload : country
                );
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //delete Country
            .addCase(deleteCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = state.countries.filter((country) => country._id !== action.payload);
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
})


export default countrySlice.reducer;