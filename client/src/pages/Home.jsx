import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";

const Home = () => {
  // State to toggle sidebar (mobile view only)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  // State to track which component is selected from Sidebar
  const [SelectedComponent, setSelectedComponent] = useState("");

  // Get user details & authentication status from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // If not authenticated → redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  /**
   * Function to decide which component to render
   * based on the `SelectedComponent` value
   */
  const renderComponent = () => {
    switch (SelectedComponent) {
      case "Dashboard":
        // Show different dashboards for User & Admin
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;

      case "Books":
        return <BookManagement />;

      case "Catalog":
        // Only Admins can access Catalog
        return user?.role === "Admin" ? <Catalog /> : <p>Not Authorized</p>;

      case "Users":
        // Only Admins can access Users list
        return user?.role === "Admin" ? <Users /> : <p>Not Authorized</p>;

      case "My Borrowed Books":
        return <MyBorrowedBooks />;

      default:
        // Default fallback → show dashboard based on role
        return user?.role === "User" ? <UserDashboard /> : <AdminDashboard />;
    }
  };

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      {/* -------------------- HAMBURGER MENU (mobile only) -------------------- */}
      <div
        className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center
        bg-black rounded-md h-9 w-9 text-white"
      >
        <GiHamburgerMenu
          className="text-2xl"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>

      {/* -------------------- SIDEBAR -------------------- */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* -------------------- MAIN CONTENT -------------------- */}
      {renderComponent()}
    </div>
  );
};

export default Home;
