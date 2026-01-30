import { configureStore } from "@reduxjs/toolkit";

// Import reducers (auth aur popup ke slices ka reducer)
import authReducer from '../store/slices/authSlice'
import popupReducer from '../store/slices/popUpSlice'

// Redux store create kar rahe hain
export const store = configureStore({
    reducer: {
        // "auth" slice ka reducer (login/logout ka data manage karega)
        auth: authReducer,

        // "popup" slice ka reducer (saare popups ka state manage karega)
        popup: popupReducer,
    },
})
