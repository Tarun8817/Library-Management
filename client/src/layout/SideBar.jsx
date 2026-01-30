import { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import usersIcon from "../assets/people.png";
import settingIcon from "../assets/setting-white.png";

import { RiAdminFill } from "react-icons/ri"; // Icon for "Add Admin"

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import { logout, clearMessages } from "../store/slices/authSlice";

import { toast } from "react-toastify";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
const SideBar = ({ isSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();

  // Popup state from Redux
  const { addNewAdminPopup , settingPopup } = useSelector((state) => state.popup);

  // Auth state from Redux
  const { error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  // Show toast for error/success messages
  useEffect(() => {
    if (error) {
      toast.error(error); // Show error message
      dispatch(clearMessages()); // Clear only messages, not auth state
    }
    if (message) {
      toast.success(message); // Show success message
      dispatch(clearMessages()); // Clear only messages, not auth state
    }
  }, [dispatch, error, message]);

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
        {/* Logo section */}
        <div className="px-6 py-4">
          <img src={logo_with_title} alt="logo" />
        </div>

        {/* Navigation section */}
        <nav className="flex-1 px-6 mt-6 space-y-2 overflow-y-auto">
          {/* Dashboard button */}
          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          {/* Books button */}
          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" className="h-5 w-5" />
            <span>Books</span>
          </button>

          {/* Admin-specific options */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              {/* Catalog button */}
              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" className="h-5 w-5" />
                <span>Catalog</span>
              </button>

              {/* Users button */}
              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" className="h-5 w-5" />
                <span>Users</span>
              </button>

              {/* Add new admin popup button */}
              <button
                className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-6 h-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {/* User-specific option */}
          {isAuthenticated && user?.role === "User" && (
            <button
              className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
              onClick={() => setSelectedComponent("My Borrowed Books")}
            >
              <img src={catalogIcon} alt="icon" className="h-5 w-5" />
              <span>My Borrowed Books</span>
            </button>
          )}

          {/* Update credentials (common for all users) */}
          <button
            className="w-full py-2 font-medium flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" className="h-5 w-5" />
            <span>Update Credentials</span>
          </button>
        </nav>

        {/* Logout button at bottom */}
        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full py-2 flex items-center justify-center space-x-2 font-medium hover:cursor-pointer"
          >
            <img src={logoutIcon} alt="icon" className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Render Add New Admin popup if open */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup/>}
    </>
  );
};

export default SideBar;
