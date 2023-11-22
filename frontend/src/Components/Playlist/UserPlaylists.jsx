/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faEllipsisH,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  usePlaylistsSelector,
  useSetPlaylists,
} from "../../redux/reducers/playlists";

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const fetchPlaylist = async (name) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/playlists/name/${name}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const UserPlaylist = () => {
  const { name } = useParams();
  const [Playlist, setPlaylist] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(null);
  const UserPlaylist = usePlaylistsSelector();
  const setPlaylists = useSetPlaylists();
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlaylist(name);
        setPlaylist(data);
      } catch (error) {
        console.log(error);
        setPlaylist([]); // Set an empty array in case of an error to avoid 'undefined'
      }
    };
    fetchData();
  }, [name]);

  const handleLoveClick = (index) => {
    // Dispatch action to update loved status in the Redux store
    // Example: dispatch(updateLovedStatus(playlists[index]._id));
  };

  const handleNext = () => {
    setCurrentPlaylistIndex((prevIndex) => (prevIndex + 1) % Playlist.length);
  };

  const handlePrev = () => {
    setCurrentPlaylistIndex((prevIndex) =>
      prevIndex === 0 ? Playlist.length - 1 : prevIndex - 1
    );
  };

  const handlePlaylistClick = (index) => {
    setCurrentPlaylistIndex(index);
  };

  const handleDeleteFromPlaylist = async (podcastId) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/playlists/name/${name}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ podcast_id: podcastId }),
      });

      if (response.ok) {
        setShowDropdown(!showDropdown);
        alert("Deleted");

        // Fetch the updated playlist after deletion
        const updatedPlaylist = await fetchPlaylist(name);

        // Dispatch the action with the updated playlist
        setPlaylists(updatedPlaylist);
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting to playlist:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/playlists/name/${name}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Playlist deleted");
        Navigate("/user");
        // Optionally, redirect to another page or handle the deletion as needed
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error deleting playlist:", error);
    }
  };

  if (!Playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className="sm:flex">
        <h2 className="text-2xl font-semibold mb-2">{name} Podcasts</h2>
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded ml-auto hover:bg-red-500"
          onClick={handleDeletePlaylist}
        >
          Delete Playlist
        </button>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="w-2/3 m-2">
          {Playlist &&
            Playlist.map((playlist, index) => (
              <div
                key={index}
                className={`playlist-item border p-2 mb-2 rounded-lg bg-white transition duration-300 ease-in-out hover:bg-gray-200 flex items-center justify-between`}
                onClick={() => handlePlaylistClick(index)}
              >
                <div className="flex flex-col items-start">
                  <div className="">
                    <h6 className="font-semibold text-sm">
                      <span className="mr-2">{index + 1}</span>
                      {playlist.title}
                    </h6>
                  </div>
                  <p className="text-xs text-gray-600">
                    {playlist.description}
                  </p>
                </div>
                <div className="flex items-center relative">
                  <button
                    onClick={() => handleLoveClick(index)}
                    className={`text-gray-500 focus:outline-none ${
                      playlist.loved ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`h-4 w-4 ${
                        playlist.loved ? "text-blue-500" : "text-gray-500"
                      }`}
                    />
                  </button>
                  <span className="mx-2 text-gray-500 text-xs">
                    {formatDuration(playlist.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(showDropdown === index ? null : index);
                    }}
                    className={`ml-2 text-gray-500 focus:outline-none ${
                      showDropdown === index ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
                  </button>

                  {showDropdown === index && (
                    <div className="absolute top-full left-0 mt-1 z-20">
                      <div
                        id="dropdownDotsHorizontal"
                        className="z-20 bg-white divide-y divide-blue-100 rounded-lg shadow w-32 dark:bg-blue-700 dark:divide-blue-600"
                      >
                        <ul className="py-1 text-xs text-gray-700 dark:text-gray-200">
                          <li>
                            <a
                              className="block py-2 hover:bg-gray-100 dark:hover:bg-white-600 dark:hover:text-black text-center"
                              onClick={() =>
                                handleDeleteFromPlaylist(playlist._id)
                              }
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="h-4 w-4 mr-2"
                              />
                              Remove
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-2 relative z-10">
          <AudioPlayer
            imgSrc={Playlist[currentPlaylistIndex]?.image_url}
            title={Playlist[currentPlaylistIndex]?.title}
            podcastUrl={Playlist[currentPlaylistIndex]?.audio_url}
            duration={Playlist[currentPlaylistIndex]?.duration}
            playlists={Playlist}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPlaylist;
