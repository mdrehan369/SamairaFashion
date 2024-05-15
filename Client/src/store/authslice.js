import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    user: null,
    location: {
        isIndia: true,
        dirham_to_rupees: 22
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.user = action.payload;
            return state;
        },

        logout: (state) => {
            state.status = false;
            state.user = null
            return state;
        },

        setLocation: (state, action) => {
            state.location = {
                isIndia: action.payload.isIndia,
                dirham_to_rupees: action.payload.dirham_to_rupees || 22
            }
            return state;
        }
    }
});

export const { login, logout, setLocation } = authSlice.actions;

export default authSlice.reducer;