/* eslint-disable react/prop-types */
import { useCategoriesSelector } from "../../redux/reducers/categories";
import React, { useState, useEffect, useRef } from "react";


const Latest = () => {
  const { latest: latestData } = useCategoriesSelector();
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(null);

  const handleTogglePlay = (index) => {
    if (currentlyPlayingIndex === index) {
      setCurrentlyPlayingIndex(null);
    } else {
      setCurrentlyPlayingIndex(index);
    }
  };

  // Check if latestData is an array before using map
  if (!Array.isArray(latestData.data)) {
    console.error("latestData is not an array:", latestData);
    return null; // or render an appropriate message
  }
  const reversedData = [...latestData.data].reverse();

  return (
    <div className="container mx-auto sm:px-2 md:px-5">
      <h2 className="text-lg px-2 py-2 font-semibold sm:text-xl">Latest</h2>
      <div className="overflow-x-auto ">
      <div className="flex flex-wrap gap-5 justify-center">
          {reversedData.map((podcast, index) => (
            <PodcastCard
              key={index}
              index={index}
              title={podcast.title}
              description={podcast.description}
              imageUrl={podcast.image_url}
              podcastUrl={podcast.audio_url}
              genres={podcast.genres}
              duration={podcast.duration}
              isPlaying={currentlyPlayingIndex === index}
              onTogglePlay={handleTogglePlay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PodcastCard = ({
  index,
  title,
  description,
  imageUrl,
  podcastUrl,
  genres,
  duration,
  isPlaying,
  onTogglePlay,
}) => {
  // Set the maximum number of genres to display
  const maxGenres = 1;
  const truncatedGenres = genres.slice(0, maxGenres);
  const remainingGenres = genres.length - maxGenres;

  const audioRef = useRef(new Audio(podcastUrl));
  const [audioEnded, setAudioEnded] = useState(false);

  useEffect(() => {
    const handleAudioEnded = () => {
      setAudioEnded(true);
      onTogglePlay(index); // Pause the audio
    };

    audioRef.current.addEventListener("ended", handleAudioEnded);

    return () => {
      audioRef.current.removeEventListener("ended", handleAudioEnded);
    };
  }, [index, onTogglePlay]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    onTogglePlay(index);
  };

  const playButtonIcon = isPlaying ? "Pause" : "Play";

  return (
    <div className="rounded-lg overflow-hidden shadow-lg w-full sm:w-56 min-w-xs border border-gray-200 hover:bg-blue-200 hover:border-gray-300 transform transition-transform duration-300 hover:scale-95">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-32 sm:h-48 object-cover"
      />
      <div className="px-5 pt-2">
        <div className="font-bold text-lg">{title}</div>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      <div className="px-3 pb-5 pt-2 overflow-x-auto">
        <div className="flex flex-wrap sm:flex-no-wrap min-w-mx">
          {truncatedGenres.map((genre, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-2 mx-1 my-1 py-1 text-sm font-semibold text-gray-700"
            >
              {genre}
            </span>
          ))}
          {remainingGenres > 0 && (
            <span className="inline-block bg-gray-200 rounded-full px-2 mx-1 my-1 py-1 text-sm font-semibold text-gray-700">
              +{remainingGenres} more
            </span>
          )}
          <span className="inline-block bg-gray-200 rounded-full px-2 mx-1 my-1 py-1 text-xs font-semibold text-gray-700">
            {Math.round(duration / 60)} mins
          </span>
          <button
            className="inline-block bg-gray-200 rounded-full px-2 mx-1 my-1 py-1 text-xs font-semibold text-gray-700 cursor-pointer"
            onClick={handleTogglePlay}
          >
            <i
              className={`fa ${
                audioEnded || !isPlaying ? "fa-play" : "fa-pause"
              } fa-1x text-blue-500`}
              id="play-btn"
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Latest;
