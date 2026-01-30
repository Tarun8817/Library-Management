import { createSlice } from '@reduxjs/toolkit'

// Redux slice for managing popups
const popupSlice = createSlice({
    name: "popup",

    // Initial state -> yeh sab popups false (band) rahenge by default
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false,
        addNewAdminPopup: false,
    },

    // Reducers -> ye functions state ko update karenge
    reducers: {
        // Setting popup open/close toggle
        toggleSettingPopup(state) {
            state.settingPopup = !state.settingPopup;
        },

        // Add Book popup toggle
        toggleAddBookPopup(state) {
            state.addBookPopup = !state.addBookPopup;
        },

        // Read Book popup toggle
        toggleReadBookPopup(state) {
            state.readBookPopup = !state.readBookPopup;
        },

        // Record Book popup toggle
        toggleRecordBookPopup(state) {
            state.recordBookPopup = !state.recordBookPopup;
        },

        // Add New Admin popup toggle
        toggleAddNewAdminPopup(state) {
            // ⚠️ Yaha galti thi tumhare code me -> 
            // tum `addBookPopup` ka use kar rahe the instead of `addNewAdminPopup`
            state.addNewAdminPopup = !state.addNewAdminPopup;
        },

        // Return Book popup toggle
        toggleReturnBookPopup(state) {
            state.returnBookPopup = !state.returnBookPopup;
        },

        // Sab popups ek sath band karne ke liye
        colseAllPopup(state) {
            state.addBookPopup = false;
            state.addNewAdminPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.returnBookPopup = false;
            state.settingPopup = false;
        },
    },
});

// Reducer actions ko export kar rahe hain
export const {
    colseAllPopup,
    toggleAddNewAdminPopup,
    toggleAddBookPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup,
    toggleReturnBookPopup,
    toggleSettingPopup
} = popupSlice.actions;

// Final reducer export
export default popupSlice.reducer;
