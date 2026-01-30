// userSlice.js


import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import AddNewAdmin from "../../popups/AddNewAdmin";
import { toggleAddNewAdminPopup } from "./popUpSlice";

// User slice create kar rahe hain
const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true;
        },
        fetchAllUsersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed(state) {
            state.loading = false;
        },
        AddNewAdminRequest(state) {
            state.loading = true;
        },
        AddNewAdminSuccess(state, action) {
            state.loading = false;
            state.users.push(action.payload);
            toast.success("New admin added successfully");
        },
        AddNewAdminFailed(state) {
            state.loading = false;
            toast.error("Failed to add new admin");
        }
    }
});


// Thunk action to fetch all users from the server
export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios
        .get("http://localhost:4000/api/v1/user/all", { withCredentials: true })
        .then(res => {
            dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
        })
        .catch(err => {
            dispatch(userSlice.actions.fetchAllUsersFailed());
            console.error("Fetch Users Error:", err.message);
        });
};


// Thunk action to add a new admin
export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.AddNewAdminRequest());
    await axios
        .post("http://localhost:4000/api/v1/user/add/new-admin", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            dispatch(userSlice.actions.AddNewAdminSuccess(res.data.user))
            toast.success(res.data.message);
            dispatch(toggleAddNewAdminPopup)
        })
                .catch(err => {
                    userSlice.actions.AddNewAdminFailed();
                    console.error(err.response.data.message);
                });
        };
export default userSlice.reducer;