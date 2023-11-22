/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetUser, useUserSelector } from "../../redux/reducers/user"; // Import your user slice actions and selector
import Favourite from "./Favourite";
import Navbar from "./Navbar";
import Genres from "./genres";
import Popular from "./Popular";
import Latest from "./Latest";
import Fotter from "../Home/Fotter";
import { useFetchTrendingAndLatest} from "../../redux/reducers/categories";

const User = () => {
  const navigate = useNavigate();
  const setUser = useSetUser();
  const user = useUserSelector();
  const setTrendingAndLatest =useFetchTrendingAndLatest()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/auth/user`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/");
          return;
        }

        const data = await response.json();

        // Set user data regardless of whether it has changed
        setUser(data.user);
      } catch (error) {
        navigate("/");
      }
    };

    // Run the fetchData function only once when the component mounts
    fetchData();
    setTrendingAndLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // Empty dependency array ensures that this effect runs only once

  if (!user) {
    return null; // Return early if userData is not available
  }

  return (
    <>
      <Navbar />
      <Popular />
      <Favourite />
      <Latest />
      <Genres />
      <Fotter />
    </>
  );
};

export default User;
