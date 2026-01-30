import { createSlice} from "@reduxjs/toolkit";
import axios from "axios";

// Book slice create kar rahe hain
const bookSlice = createSlice({
    name: "book",
    initialState:{
      loading: false,
      error:null,
      message:null,
      books:[],
    },
    reducers:{
      fetchBooksRequest:(state)=>{
        state.loading = true;
        state.error = null;
        state.message = null;
      },
      fetchBooksSuccess:(state, action)=>{
        state.loading = false;
        state.books = action.payload;
        state.message = null;
      },
      fetchBooksFailed(state,action){
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      },
      addBookRequest:(state)=>{
        state.loading = true;
        state.error = null;
        state.message = null;
      },
      addBookSuccess:(state, action)=>{
        state.loading = false;
        state.message = action.payload;
      },
      addBookFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      resetBookSlice(state){
        state.error = null;
        state.message = null;
        state.loading = false;
      },
    },
  });


  // Thunk action to fetch all books from the server
  export const fetchAllBooks = () => async (dispatch) => {
    dispatch(bookSlice.actions.fetchBooksRequest());
    await axios.get("http://localhost:4000/api/v1/book/all",{
      withCredentials:true,
    }).then((res)=>{
      dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));  
    }).catch((err=>{
      dispatch(bookSlice.actions.fetchBooksFailed(err.response.data.message));
      console.error(err);   
    }));
  };

  // Thunk action to add a new book
  export const addBook = (data) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest());
    await axios
        .post("https://localhost:4000/api/v1/book/add", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(res => {
            dispatch(bookSlice.actions.addBookSuccess(res.data.message));
        })
        .catch(err => {
            dispatch(bookSlice.actions.addBookFailed(err.response.data.message));
        });
};

export const resetBookSlice = () =>(dispatch)=>{
  dispatch(bookSlice.actions.resetBookSlice());
}


// Book slice ka reducer export kar rahe hain
  export  default bookSlice.reducer;

  