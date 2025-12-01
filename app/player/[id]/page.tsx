"use client";

import { useParams } from "next/navigation";
import { useGetBookByIdQuery } from "@/Redux/booksSlice";
import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const PlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: book,
    isLoading: booksLoading,
    isError: booksError,
  } = useGetBookByIdQuery(id);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  const formatTime = (time: number | undefined): string => {
    if (typeof time === "number" && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);

      const formatMinutes = minutes.toString().padStart(2, "0");
      const formatSeconds = seconds.toString().padStart(2, "0");
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  const playAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress(); // Ensure progress is updated immediately when paused
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  const handleProgressBarChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      setTimeProgress(newTime);
      // if progress bar changes while audio is on pause
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(newTime / duration) * 100}%`
      );
    }
  };

  const handlePlay = (e: SyntheticEvent<HTMLAudioElement, Event>) =>
    setIsPlaying(true);
  const handlePause = (e: SyntheticEvent<HTMLAudioElement, Event>) =>
    setIsPlaying(false);
  const handleEnded = (e: SyntheticEvent<HTMLAudioElement, Event>) =>
    setIsPlaying(false);

  const togglePlayAndPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          setIsPlaying(false);
        });
      }
    }
  };

  console.log(useGetBookByIdQuery(id));
  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="summary">
        <div className="audio__book--summary" style={{ fontSize: "16px" }}>
          <div className="audio__book--summary-title">
            <b>{book?.title}</b>
          </div>
          <div className="audio__book--summary-text">{book?.summary}</div>
        </div>
        <div className="audio__wrapper">
          <audio
            src={book?.audioLink}
            ref={audioRef}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onLoadedMetadata={onLoadedMetadata}
          />
          <div className="audio__track--wrapper">
            <figure className="audio__track--image-mask">
              <figure
                className="book__image--wrapper"
                style={{ height: "48px", width: "48px", minWidth: "48px" }}
              >
                <img
                  className="book__image"
                  src={book?.imageLink}
                  alt="book"
                  style={{ display: "block" }}
                />
              </figure>
            </figure>
            <div className="audio__track--details-wrapper">
              <div className="audio__track--title">{book?.title}</div>
              <div className="audio__track--author">{book?.author}</div>
            </div>
          </div>
          <div className="audio__controls--wrapper">
            <div className="audio__controls">
              <button className="audio__controls--btn">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="#000"
                    stroke-width="2"
                    d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
                  ></path>
                </svg>
              </button>
              <button
                onClick={togglePlayAndPause}
                className="audio__controls--btn audio__controls--btn-play"
              >
                {isPlaying ? (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 432h-80V80h80zm144 0h-80V80h80z"></path>
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 512 512"
                    className="audio__controls--play-icon"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M96 448l320-192L96 64v384z"></path>
                  </svg>
                )}
              </button>
              <button className="audio__controls--btn">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="#000"
                    stroke-width="2"
                    d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="audio__progress--wrapper">
            <div className="audio__time">{formatTime(timeProgress)}</div>
            <input
              onChange={handleProgressBarChange}
              ref={progressBarRef}
              type="range"
              className="audio__progress--bar"
              value={timeProgress}
              max={duration}
              /*style={{
                background:
                  "linear-gradient(to right, rgb(43, 217, 124) 0%, rgb(109, 120, 125) 0%); --range-progress: 0%;",
              }}*/
            />
            <div className="audio__time">{formatTime(duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
