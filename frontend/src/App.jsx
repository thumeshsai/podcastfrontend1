/* eslint-disable no-unused-vars */
import Admin from "./Components/Admin/Admin";
import Home from "./Components/Home/Home";
import User from "./Components/User/User";
import GenrePlaylists from "./Components/Playlist/GenrePlaylists";
import UserPlaylists from "./Components/Playlist/UserPlaylists"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
export default function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/playlists/:genre" element={<GenrePlaylists />} />
            <Route path="/playlist/:name" element={<UserPlaylists />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}