import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authslice.js";
import themeslice from "./themeslice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        theme: themeslice
    }
});
