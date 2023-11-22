/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Navbar from "../User/Navbar.jsx";
import Uplod from "./Uplod";
import FileUpload from "./FileUpload";
import AudioItem from "./AudioItem";
import { useNavigate } from "react-router-dom";
import { useSetUser, useUserSelector } from "../../redux/reducers/user.js"; // Import your user slice actions and selector

function Creator() {
  const navigate = useNavigate();
  const setUser = useSetUser();
  const user = useUserSelector();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/auth/admin`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        navigate("/");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (!user) {
    return null; // Return early if userData is not available
  }

  return (
    <div className="mobile-container">
      <Navbar />
      <div className="mx-4">
        <h2 className="mx-3">Welcome, {user.username}!</h2>
        <div className="flex">
          <Uplod />
          <FileUpload />
        </div>
        <AudioItem />
      </div>
    </div>
  );
}

export default Creator;
