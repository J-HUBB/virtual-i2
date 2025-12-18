import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TextSizeState {
    fontSize: number;
}

const initialState: TextSizeState = {
    fontSize: 16,
};

const textSizeSlice = createSlice({
    name: 'textSettings',
    initialState,
    reducers: {
        setFontSize: (state, action: PayloadAction<number>) => {
            state.fontSize = action.payload;
        },
    },
});

export const { setFontSize } = textSizeSlice.actions;
export default textSizeSlice.reducer;