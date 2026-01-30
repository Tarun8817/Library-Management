import React, { useEffect, useState } from 'react'
import { BookA, NotebookPen } from "lucide-react"
import { useDispatch, useSelector, } from 'react-redux'
import { toggleReadBookPopup, toggleRecordBookPopup } from '../store/slices/popUpSlice';
import { toast } from "react-toastify"

import { fetchAllBorrowedBooks, resetBorrowSlice } from '../store/slices/borrowSlice';
import { fetchAllBooks, resetBookSlice } from '../store/slices/bookSlice';

import Header from "../layout/Header"

const BookManagement = () => {

  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector(state => state.book)
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup, } = useSelector(state => state.popup);
  const { loading: borrowSliceLoading, error: borrowSliceError, message: borrowSliceMessage } = useSelector(state => state.borrow);

  const [readBook, setReadBook] = useState({})
  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };
  
  const [borrowBookId, setBorrowBookId] = useState(null);

  const openRecordBookPopup = (bookid) => {
    setBorrowBookId(bookid);
    dispatch(toggleRecordBookPopup());

  };

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
      dispatch(resetBookSlice());
    }
    if(error || borrowSliceError){
      toast.error(error || borrowSliceError);
      dispatch(resetBorrowSlice());
      dispatch(resetBookSlice());
    }
    // Corrected dependency array: Removed loading and borrowSliceLoading
  }, [dispatch, message, error, borrowSliceError, borrowSliceMessage]); 


  const [searchedKeyword, setSearchKeyword] = useState("");
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };
  
  // You define searchBooks here, but you aren't using it yet in your JSX.
  // Your next step will be to map over this array to display the books.
  const searchBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword) ||
    book.author.toLowerCase().includes(searchedKeyword) ||
    book.genre.toLowerCase().includes(searchedKeyword)
  );
  
  return (
    <>
      <main className='relative flex-1 p-6 pt-28'>
        <Header/>

        {/*Sub Header*/}
        <header className='flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
          <h1 className='text-xl font-medium md:text-2xl md:font-semibold'>
            {user && user.role === 'Admin' ? "Book Management" : "Books"}
          </h1>
            <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
              {
                isAuthenticated && user && user.role === 'Admin' && (
                  <button
                  className='relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300 ease-in-out'
                    onClick={() => dispatch(toggleRecordBookPopup())}
                    >
                      <span className='bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[27px] absolute left-5'>+
                      </span>
                      Add New Book
                    </button>
              )}
              <input
                type="text"
                placeholder="Search books..."
                value={searchedKeyword}
                onChange={handleSearch}
                className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
              />
            </div>
        </header>

        {/*Table*/}
        {
          books && books.length > 0 ? (
            <div className='mt-6 overflow-auto bg-white rounded-md shadhow-lg'>
              <table className='min-w-full border-collapse'>
                <thead>
                  <tr className='mg-gray-200'>
                    <th className='px-4 py-2 text-left'>ID</th>
                    <th className='px-4 py-2 text-left'>Name</th>
                    <th className='px-4 py-2 text-left'>Author</th>

                    {isAuthenticated && user ?.role === "Admin" &&(
                        <th className='px-4 py-2 text-left'>Quantity</th>
                      )}
                    <th className='px-4 py-2 text-left'>Price</th>
                    <th className='px-4 py-2 text-left'>Availability</th>

                    {isAuthenticated && user ?.role === "Admin" &&(
                        <th className='px-4 py-2 text-center'>Record Book</th>
                      )}



                  </tr>
                </thead>
                <tbody>
                  {
                    searchBooks.map((book,index)=>{
                      <tr 
                      key={book._id} 
                      className={(index + 1) %2 === 0 ? "bg-gray-50" :""}>
                        <td className='px-4 py-2'>{index+1}</td>
                        <td className='px-4 py-2'>{book.title}</td>
                        <td className='px-4 py-2'>{book.author}</td>

                        {isAuthenticated && user ?.role === "Admin" &&(
                        <th className='px-4 py-2'>{book.quantity}</th>
                      )}

                      </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          ) : (" ")
        }

      </main>
    </>
  )
}

export default BookManagement;


