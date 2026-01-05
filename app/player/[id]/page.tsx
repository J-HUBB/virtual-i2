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
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Skeleton from "@/components/SkeletonLoading";

const PlayerPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
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
  const handleEnded = async (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    if (user && id) {
      try {
        const bookRef = doc(db, "users", user.uid, "library", id);
        await setDoc(
          bookRef,
          {
            status: "finished",
            title: book?.title,
            author: book?.author,
            imageLink: book?.imageLink,
            subTitle: book?.subTitle,
            audioLink: book?.audioLink,
            averageRating: book?.averageRating,
            addedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating book status:", error);
      }
    }

    setIsPlaying(false);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
      updateProgress();
    }
  };

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

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress();
    }
  };

  const fontSize = useSelector(
    (state: RootState) => state.textSettings.fontSize
  );

  //  const handleFinished = async () => {
  //   if (user) {
  //     const bookRef = doc(db, 'users', user.uid, 'library', currentBookId);
  //     await updateDoc(bookRef, { status: 'finished' });
  //   }
  //  };

  console.log(useGetBookByIdQuery(id));

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="summary">
        {booksLoading ? (
          <div className="audio__book--spinner">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              version="1.1"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
            </svg>
          </div>
        ) : (
          <div className="audio__book--summary" style={{ fontSize: fontSize }}>
            <div className="audio__book--summary-title">
              <b>{book?.title}</b>
            </div>
            <div className="audio__book--summary-text">{book?.summary}</div>
          </div>
        )}
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
              {booksLoading ? (
                <figure
                  className="book__image--wrapper"
                  style={{ height: "48px", width: "48px", minWidth: "48px" }}
                >
                  <Skeleton width={"48px"} height={"48px"} display={"block"} />
                </figure>
              ) : (
                <figure
                  className="book__image--wrapper"
                  style={{ height: "48px", width: "48px", minWidth: "48px" }}
                >
                  <img
                    className="book__image"
                    src={book?.imageLink}
                    alt="book"
                    style={{ display: "block" }}
                    loading="lazy"
                  />
                </figure>
              )}
            </figure>
            <div className="audio__track--details-wrapper">
              {booksLoading ? (
                <>
                  <div className="audio__track--title">
                    <Skeleton
                      width={"45px"}
                      height={"16px"}
                      display={"block"}
                    />
                  </div>
                  <div className="audio__track--author">
                    <Skeleton
                      width={"89px"}
                      height={"16px"}
                      display={"block"}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="audio__track--title">{book?.title}</div>
                  <div className="audio__track--author">{book?.author}</div>
                </>
              )}
            </div>
          </div>
          <div className="audio__controls--wrapper">
            <div className="audio__controls">
              <button onClick={skipBackward} className="audio__controls--btn">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
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
                    strokeWidth="0"
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
                    strokeWidth="0"
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
              <button onClick={skipForward} className="audio__controls--btn">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
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
