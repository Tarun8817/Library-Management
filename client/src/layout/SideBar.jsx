import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import usersIcon from "../assets/people.png";
import settingIcon from "../assets/setting-white.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RiAdminFill } from "react-icons/ri";
// Redux actions import
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toggleAddNewAdminPopup,toggleSettingsPopup} from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";

const SideBar = ({ isSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();

  // popup state redux se le rhe hai
  const { addNewAdminPopup } = useSelector((state) => state.popup);

  // auth slice se values le rhe hai
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // logout ke liye function
  const handleLogout = () => {
    dispatch(logout());
  };   

  // error ya success message show karne ke liye
  useEffect(() => {
    if (error) {
      toast.error(error); // agar error aaya to toast show karo
      dispatch(resetAuthSlice()); // error reset kar do redux se
    }
    if (message) {
      toast.success(message); // agar success message hai to show karo
      dispatch(resetAuthSlice()); // message reset kar do redux se
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-black text-white flex flex-col z-20
          transition-transform duration-700
          ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar ke top me logo */}
        <div className="px-6 py-4">
          <img src={logo_with_title} alt="logo" />
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-6 mt-6 space-y-2 overflow-y-auto">
          {/* Dashboard button */}
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          {/* Books button */}
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" className="h-5 w-5" />
            <span>Books</span>
          </button>

          {/* Admin role wale users ke liye options */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              {/* Catalog button */}
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" className="h-5 w-5" />
                <span>Catalog</span>
              </button>

              {/* Users button */}
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" className="h-5 w-5" />
                <span>Users</span>
              </button>

              {/* Add new admin popup open karne ke liye button */}
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {/* Normal user ke liye option */}
          {isAuthenticated && user?.role === "User" && (
            <button
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              onClick={() => setSelectedComponent("My Borrowed Books")}
            >
              <img src={catalogIcon} alt="icon" className="h-5 w-5" />
              <span>My Borrowed Books</span>
            </button>
          )}
          {/* Common option jo sabko dikhna chahiye */}
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={()=> dispatch(toggleSettingsPopup())}
          >
            <img src={settingIcon} alt="icon" className="h-5 w-5" />
            <span>Update Credentials</span>
          </button>
        </nav>

        {/* Sidebar ke bottom me logout button */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="py-2 font-medium text-center bg-transparent 
            rounded-md hover:cursor-pointer 
            flex items-center justify-center space-x-2 w-full"
          >
            <img src={logoutIcon} alt="icon" className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Add New Admin wala popup, agar true hoga to render karega */}
      {addNewAdminPopup && <AddNewAdmin />}
    </>
  );
};

export default SideBar;
