/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../firebase.js";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function FileUpload({ setPopupVisible, isPopupVisible }) {
  const [podCastName, setpodCastName] = useState("");
  const [description, setDescription] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/categories`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        // Filter out "Trending" and "Latest" genres
        const filteredGenres = data.filter(
          (genre) => genre.name !== "Trending" && genre.name !== "Latest"
        );
        setGenres(filteredGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const onClose = () => {
    setPopupVisible(false);
    setpodCastName("");
    setDescription("");
    setAudio(null);
    setImage(null);
    setError("");
    setSelectedGenres([]); // Clear selected genres
  };

  const handleUpload = async () => {
    try {
      // Validate inputs
      if (
        !podCastName ||
        !description ||
        !audio ||
        !image ||
        selectedGenres.length === 0
      ) {
        setError("Please fill all fields.");
        return;
      }

      setLoading(true);

      // Upload audio
      const audioStorageRef = ref(storage, `podcasts/audio/${uuidv4()}`);
      const audioSnapshot = await uploadBytes(audioStorageRef, audio);
      const audioUrl = await getDownloadURL(audioSnapshot.ref);

      // Upload image
      const imageStorageRef = ref(storage, `podcasts/images/${uuidv4()}`);
      const imageSnapshot = await uploadBytes(imageStorageRef, image);
      const imageUrl = await getDownloadURL(imageSnapshot.ref);

      // Measure audio duration
      // Measure audio duration using a temporary audio element
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(audio);

      // Wait for the audio metadata to load
      await new Promise((resolve) => {
        audioElement.onloadedmetadata = resolve;
      });

      // Get the audio duration
      const audioDuration = audioElement.duration;

      // Send data to backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/podcasts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: podCastName,
          description,
          audio_url: audioUrl,
          image_url: imageUrl,
          genres: selectedGenres, // Send selected genres
          duration: audioDuration,
        }),
      });
      console.log(selectedGenres)

      if (response.ok) {
        onClose();
        // Handle success, e.g., navigate to another page
        window.location.reload();
      } else {
        // Handle error from backend
        const data = await response.json();
        setError(data.message || "An error occurred during upload.");
        await deleteObject(audioStorageRef);
        await deleteObject(imageStorageRef);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genreId) => {
    // Toggle the selection of the genre
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId);
      } else {
        return [...prevGenres, genreId];
      }
    });
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <div
        className={`fixed bg-gray-300 bg-opacity-70 inset-0 flex items-center justify-center z-50 ${
          isPopupVisible ? "" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-lg w-full md:w-1/2 lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Fill the below details to Upload
          </h2>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div>
            <label className="block text-gray-700 text-sm font-semibold">
              Podcast Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={podCastName}
              onChange={(e) => setpodCastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold">
              Description
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold">
              Audio
            </label>
            <input
              type="file"
              accept="audio/*"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setAudio(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold">
              Genres
            </label>
            <div className="grid grid-cols-4">
              {genres.map((genre) => (
                <div key={genre._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={genre.name}
                    checked={selectedGenres.includes(genre.name)}
                    onChange={() => handleGenreChange(genre.name)}
                    className="mr-0.5"
                  />
                  <label htmlFor={genre._id}>{genre.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <button
              onClick={handleUpload}
              className="bg-green-500 hover:bg-green-600 rounded p-2 text-white w-1/2 mr-3"
            >
              Upload
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-red-400 rounded p-2 w-1/2 ml-3 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FileUpload;
