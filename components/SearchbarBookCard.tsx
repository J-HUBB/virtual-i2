"use client";

import { book } from "@/Redux/booksSlice";
import { useRef, useState } from "react";
import Skeleton from "./SkeletonLoading";

const SearchbarBookCard = ({
  id,
  author,
  title,
  subTitle,
  imageLink,
  audioLink,
  totalRating,
  averageRating,
  keyIdeas,
  type,
  status,
  subscriptionRequired,
  summary,
  tags,
  bookDescription,
  authorDescription,
}: book) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState(true);


  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
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
  console.log(formatTime(duration));
  return (
    <a className="search__book--link" href={`/book/${id}`}>
      <audio
        src={audioLink}
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
      ></audio>
      <figure
        className="book__image--wrapper"
        style={{ height: "80px", width: "80px", minWidth: "80px", marginBottom: "8px" }}
      >
        {loading && <Skeleton width={"80px"} height={"80px"} display={"block"} />}
        <img
          className="book__image"
          src={imageLink}
          alt="book"
          style={{ display: loading ? "none" : "block" }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </figure>
      <div>
      <div className="search__book--title">{title}</div>
      <div className="search__book--author">{author}</div>
      <div className="search__book--duration">
        <div className="recommended__book--details">
          <div className="recommended__book--details-icon">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
              <path d="M13 7h-2v6h6v-2h-4z"></path>
            </svg>
          </div>
          <div className="recommended__book--details-text">{formatTime(duration)}</div>
        </div>
      </div>
      </div>
    </a>
  );
};

export default SearchbarBookCard;
