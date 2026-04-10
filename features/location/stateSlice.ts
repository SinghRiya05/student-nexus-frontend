import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createState, updateState, getAllStates, getStateById, deleteState } from "./StateThunk";
import { IState, StateInitialState } from "./stateModel";

const initialState: StateInitialState = {
    states: [],
    singleState: null,
    stateLoading: false,
    stateError: null,
};

const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {
        setSelectedState: (state, action: PayloadAction<IState | null>) => {
            state.singleState = action.payload;
        },
        clearStateError: (state) => {
            state.stateError = null;
        },
        clearStates: (state) => {
            state.states = [];
            state.singleState = null;
            state.stateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createState.pending, (state) => {
                state.stateLoading = true;
                state.stateError = null;
            })
            .addCase(createState.fulfilled, (state, action: PayloadAction<IState>) => {
                state.stateLoading = false;
                state.states.push(action.payload);
            })
            .addCase(createState.rejected, (state, action) => {
                state.stateLoading = false;
                state.stateError = action.payload as string;
            })
            .addCase(updateState.pending, (state) => {
                state.stateLoading = true;
                state.stateError = null;
            })
            .addCase(updateState.fulfilled, (state, action: PayloadAction<IState>) => {
                state.stateLoading = false;
                const index = state.states.findIndex((s) => s._id === action.payload._id);
                if (index !== -1) {
                    state.states[index] = action.payload;
                }
                state.singleState = null;
            })
            .addCase(updateState.rejected, (state, action) => {
                state.stateLoading = false;
                state.stateError = action.payload as string;
            })
            .addCase(getStateById.pending, (state) => {
                state.stateLoading = true;
                state.stateError = null;
            })
            .addCase(getStateById.fulfilled, (state, action: PayloadAction<IState>) => {
                state.stateLoading = false;
                state.singleState = action.payload;
            })
            .addCase(getStateById.rejected, (state, action) => {
                state.stateLoading = false;
                state.stateError = action.payload as string;
            })
            .addCase(getAllStates.pending, (state) => {
                state.stateLoading = true;
                state.stateError = null;
            })
            .addCase(getAllStates.fulfilled, (state, action: PayloadAction<IState[]>) => {
                state.stateLoading = false;
                state.states = action.payload;
            })
            .addCase(getAllStates.rejected, (state, action) => {
                state.stateLoading = false;
                state.stateError = action.payload as string;
            })
            .addCase(deleteState.pending, (state) => {
                state.stateLoading = true;
                state.stateError = null;
            })
            .addCase(deleteState.fulfilled, (state, action: PayloadAction<string>) => {
                state.stateLoading = false;
                state.states = state.states.filter((s) => s._id !== action.payload);
            })
            .addCase(deleteState.rejected, (state, action) => {
                state.stateLoading = false;
                state.stateError = action.payload as string;
            });
    },
});

export const { setSelectedState, clearStateError, clearStates } = stateSlice.actions;

export default stateSlice.reducer;