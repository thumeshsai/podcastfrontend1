import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import { storage } from "../../firebase.js";
import { ref, deleteObject } from "firebase/storage";
import PodcastItem from "./PodcastItem";

function AudioItem() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState(["All"]); // Include "All" in the initial categories
  const [searchQuery, setSearchQuery] = useState(""); // Add this line for the search query state

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/podcasts`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setPodcasts(data);
        setFilteredPodcasts(data);

        // Extract unique categories from podcasts
        const uniqueCategories = Array.from(
          new Set(data.flatMap((podcast) => podcast.genres))
        );
        setCategories(["All", ...uniqueCategories]); // Include "All" in the categories
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  const handleDelete = async (podcastId, audioUrl) => {
    try {
      // Delete the file from Firebase Storage
      const storageRef = ref(storage, audioUrl);
      await deleteObject(storageRef);

      // Send a request to delete the podcast by ID
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/podcasts/${podcastId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Remove the deleted podcast from the filtered state
        setFilteredPodcasts((prevPodcasts) =>
          prevPodcasts.filter((podcast) => podcast._id !== podcastId)
        );
      } else {
        console.error("Failed to delete podcast");
      }
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  const handleFilterChange = (category) => {
    setAnchorEl(null);
    setFilteredPodcasts(
      category === "All"
        ? podcasts
        : podcasts.filter((podcast) => podcast.genres.includes(category))
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = podcasts.filter((podcast) =>
      podcast.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPodcasts(filtered);
  };

  return (
    <div>
      <div>
        <Button
          variant="outlined"
          id="filter-button"
          aria-controls="filter-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          className="mb-2 w-full md:w-1/3 ml-2 py-2"
        >
          Filter by Category
        </Button>
        <SearchIcon className="ml-5 mr-1"/>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)} // Add this line for the onChange event
          className="mb-2 border border-gray-500 rounded-lg px-1.5 w-1/3 py-2"
        />
        <Menu
          key="menu"
          id="filter-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {categories.map((category) => (
            <MenuItem
              key={category + "_filter"}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </MenuItem>
          ))}
        </Menu>
      </div>
      {filteredPodcasts.map((podcast, index) => (
        <PodcastItem
          key={podcast._id}
          slNo={index + 1}
          img={podcast.image_url}
          title={podcast.title}
          description={podcast.description}
          audioUrl={podcast.audio_url}
          podcastId={podcast._id}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default AudioItem;
