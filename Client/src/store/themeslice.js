import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: null
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: function(state, action) {
            state.theme = action.payload
            return state;
        },
        toggleTheme: function(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            return state;
        }
    }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

