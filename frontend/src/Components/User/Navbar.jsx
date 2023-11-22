/* eslint-disable react/prop-types */
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserSelector, useClearUser } from "../../redux/reducers/user"; // Import your user slice actions and selector

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutBtn, setLogoutBtn] = useState(false);
  const navigate = useNavigate();
  const user = useUserSelector(); // Use the selector to get user data
  const clearUser = useClearUser(); // Use the action to clear user data

  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      // Make an API request to log out
      await fetch(`${backendUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      // Clear user data in the Redux store
      clearUser();

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className="bg-white shadow">
          <Toolbar className="bg-blue-100 md:px-4">
            <Typography
              className="text-black font-bold"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <div className="flex items-center ml-3">
                <Link to="/" className="flex items-center">
                  <img
                    src="/logo.gif"
                    alt="Logo"
                    className="h-10 w-10 md:h-10 md:w-10 mr-2 rounded-full object-cover"
                  />
                  <span className="text-2xl font-bold">PodCast</span>
                </Link>
              </div>
            </Typography>

            <button
              onClick={() => setLogoutBtn(!logoutBtn)}
              className="hidden md:flex items-center px-2 text-lg text-gray-800 bg-gray-100 py-2 rounded-lg hover:bg-blue-300 hover:text-white"
            >
              <Avatar style={{ width: 30, height: 30 }}>
                <PersonIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <span className="ml-2">{user.username}</span>
            </button>

            <div className="md:hidden">
              {!isMenuOpen && (
                <IconButton
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  size="large"
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      {logoutBtn && (
        <div className="absolute top-15 right-5">
          <button
            onClick={handleLogout}
            className="bg-gray-600  rounded block px-5 py-3 text-sm text-gray-100 hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-top justify-end z-50 bg-white bg-opacity-70 mobile-menu">
          <div className="bg-blue-500 pt-10 p-4 shadow-md text-white">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-2 right-2 hover:text-gray-700"
            >
              <CloseIcon />
            </button>

            <button className="block px-4 py-2 text-lg hover:bg-gray-100">
              {user.username}
            </button>

            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-lg  bg-gray-500 hover:bg-red-500 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
