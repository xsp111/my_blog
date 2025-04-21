import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaginationState {
    currentPage: number;
}

const initialState: PaginationState = {
    currentPage: 1,
};

export const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
});

export const { setPage } = paginationSlice.actions;
export default paginationSlice.reducer;