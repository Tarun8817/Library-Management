import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Borrow slice create kar rahe hain
const borrowSlice = createSlice({
  name: 'borrow',
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks:[],
    allBorrowedBooks:[],
    message: null,
  },
  reducers: {
    // Fetch books borrowed by the logged-in user
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state,action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state,action){
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    // Record Book actions
    recordBookRequest(state){
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state,action){
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state,action){
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },


    // Admin ke liye saare borrowed books fetch karne ke actions
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state,action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state,action){
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },  
    returnBookRequest(state){
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state,action){
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state,action){
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    resetBorrowSlice(state)
    {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  
    },
});


// Thunk action to fetch books borrowed by the logged-in user
export const fetchUserBorrowedBooks = () => async (dispatch) => {
    // 1. Dispatch the "request" action to set loading state
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());

    try {
        // 2. Try to make the API call and wait for the response
        const res = await axios.get("https://localhost:400/api/v1/borrow/my-borrowed-books", {
            withCredentials: true,
        });
        // 3. If successful, dispatch the "success" action with the data
        dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks));
    } catch (err) {
        // 4. If it fails, the 'catch' block will run and dispatch the "failed" action
        dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(err.response?.data?.message));
    }
};

// Thunk action to fetch all borrowed books (admin)
export const fetchAllBorrowedBooks = () => async (dispatch) => {
    // 1. Dispatch the "request" action to set loading state
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());

    try {
        // 2. Try to make the API call and wait for the response
        const res = await axios.get("http://localhost:4000/api/v1/borrow/borrowed-books-by-users", {
            withCredentials: true,
        });
        // 3. If successful, dispatch the "success" action with the data
        dispatch(
          borrowSlice.actions.fetchAllBorrowedBooksSuccess(
          res.data.borrowedBooks
        ));
    } catch (err) {
        // 4. If it fails, the 'catch' block will run and dispatch the "failed" action
        dispatch(
          borrowSlice.actions.fetchAllBorrowedBooksFailed(
            err.response?.data?.message
          ));
    }
};

// Record Borrow Book thunk action
export const recordBorrowBook = (email,id ) =>async(dispatch)=>{
  dispatch(borrowSlice.actions.recordBookRequest());
  await axios.post(`http://localhost:4000/api/v1/borrow/record-book/${id}`,{email},{
    withCredentials: true,
    headers:{
      "Content-Type":"application/json",
    },
  }
).then(res=>{
  dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
}).catch(err=>{
  dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message));
  console.error(err);
});
}

// Return Book thunk action
export const returnBook = (email,id)=>async(dispatch)=>{
  dispatch(borrowSlice.actions.returnBookRequest());
  await axios.put(`http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`,{email},{
    withCredentials: true,
    headers:{
      "Content-Type":"application/json",
    },
  }
).then(res=>{
  dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
}).catch(err=>{
  dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message));
  console.error(err);
});
};

// Reset the book slice state
export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};

// Export the reducer to be used in the store
export default borrowSlice.reducer;