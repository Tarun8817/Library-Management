import { configureStore } from "@reduxjs/toolkit";

// Import reducers (auth aur popup ke slices ka reducer)
import authReducer from '../store/slices/authSlice'
import popupReducer from '../store/slices/popUpSlice'
import userReducer from '../store/slices/userSlice'
import bookReducer from  '../store/slices/bookSlice'
import borrowReducer from '../store/slices/borrowSlice'
// Redux store create kar rahe hain
export const store = configureStore({
    reducer: {
        // "auth" slice ka reducer (login/logout ka data manage karega)
        auth: authReducer,

        // "popup" slice ka reducer (saare popups ka state manage karega)
        popup: popupReducer,

        // "user" slice ka reducer (user related data manage karega)
        user:userReducer,

        // "book" slice ka reducer (book related data manage karega)
        book: bookReducer,

        // "borrow" slice ka reducer (borrow related data manage karega)
        borrow:borrowReducer,
    },
})
