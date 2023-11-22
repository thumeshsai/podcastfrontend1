/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useSetPlaylists } from "../../redux/reducers/playlists";

const fetchPlaylists = async () => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/playlists`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};

const createPlaylist = async (name) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/playlists`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      // Handle HTTP error
      console.error("Failed to create playlist:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data; // Assuming your backend returns the created playlist object
  } catch (error) {
    console.error("Error creating playlist:", error);
    return null;
  }
};

const Favourite = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const setPlaylist = useSetPlaylists();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlaylists();
      setPlaylists(data);
      setPlaylist(data);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRandomColor = () => {
    const red = Math.floor(Math.random() * 128 + 100);
    const green = Math.floor(Math.random() * 128 + 100);
    const blue = Math.floor(Math.random() * 128 + 100);
    const color = `rgb(${red}, ${green}, ${blue})`;
    return color;
  };

  const handleCreatePlaylist = async () => {
    try {
      if (!newPlaylistName) {
        setError("Please fill all fields.");
        return;
      }
      // Create playlist
      const newPlaylist = await createPlaylist(
        newPlaylistName /* pass user_id here */
      );

      if (!newPlaylist) {
        // Handle error creating playlist
        console.error("Error creating playlist");
        // You might want to set an error state or display an error message to the user
        return;
      }
      const data = await fetchPlaylists();
      setPlaylists(data);
      setNewPlaylistName("");
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      // Handle general error (e.g., network error)
      console.error("Error creating playlist:", error);
      // You might want to set an error state or display an error message to the user
    }
  };

  const handlePlaylistSelect = (playlist) => {
    navigate(`/playlist/${playlist.name}`);
  };

  return (
    <div className="w-full">
      <Accordion className="mx-5 my-3 hover:bg-blue-50">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="font-semibold text-xl">
            Favourites / Playlists
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="container mx-auto overflow-x-auto">
            <div className="flex flex-wrap gap-5">
              {playlists.map((playlist, index) => (
                <div onClick={() => handlePlaylistSelect(playlist)} key={index}>
                  <Cards
                    key={index} // Add a unique key here, for example, playlist.id if available
                    title={playlist.name}
                    backgroundColor={getRandomColor()}
                  />
                </div>
              ))}
              <Card
                onClick={() => setIsModalOpen(true)}
                sx={{
                  width: { xs: 100, sm: 120, md: 150 },
                  height: { xs: 100, sm: 120, md: 150 },
                  backgroundColor: "#74eaf7",
                  cursor: "pointer",
                }}
              >
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <i className="fa-solid fa-plus"></i>
                  <div className="font-semibold">Create Playlist</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {isModalOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-gray-800">
          <div className="relative bg-white rounded-lg shadow">
            <div className="p-4 md:p-5 text-center">
              <TextField
                label="Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handleCreatePlaylist}
                  variant="contained"
                  color="success"
                  className="mr-2 hover:bg-gray-500"
                >
                  Create Playlist
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="contained"
                  color="error"
                  className="hover:bg-gray-500"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Cards = ({ title, backgroundColor }) => (
  <Card
    sx={{
      width: { xs: 100, sm: 120, md: 150 },
      height: { xs: 100, sm: 120, md: 150 },
      backgroundColor: backgroundColor,
    }}
  >
    <CardContent className="flex items-center justify-center h-full">
      <Typography>{title}</Typography>
    </CardContent>
  </Card>
);

export default Favourite;
