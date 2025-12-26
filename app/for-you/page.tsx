"use client";

import RecommendedBooks from "@/components/RecommendbooksCard";
import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import Skeleton from "@/components/SkeletonLoading";
import SuggestedBooks from "@/components/SuggestedbooksCard";
import {
  useGetOneBookQuery,
  book,
  useGetRecomendedBooksQuery,
  useGetSuggestedBooksQuery,
} from "@/Redux/booksSlice";
import { useRef, useState } from "react";

const forYouPage = () => {
  const {
    data: books,
    isLoading: booksLoading,
    isError: booksError,
  } = useGetOneBookQuery();
  const {
    data: recommended,
    isLoading: recommendedLoading,
    isError: recommendedError,
  } = useGetRecomendedBooksQuery();
  const {
    data: suggested,
    isLoading: suggestedLoading,
    isError: suggestedError,
  } = useGetSuggestedBooksQuery();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(0);

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
      const formatMinutes = minutes.toString().padStart(1, "0");
      const formatSeconds = seconds.toString().padStart(2, "0");
      return `${formatMinutes} mins ${formatSeconds} secs`;
    }
    return "00 mins 00 secs";
  };

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="row">
        <div className="container">
          <div className="for-you__wrapper">
            <div className="for-you__title">Selected just for you</div>
            {booksLoading ? (
              <div className="selected__book--skeleton"></div>
            ) : (
              books?.map((item: book) => (
                <a
                  key={item.id}
                  className="selected__book"
                  href={`/book/${item.id}`}
                >
                  <audio
                    src={item?.audioLink}
                    ref={audioRef}
                    preload="metadata"
                    onLoadedMetadata={onLoadedMetadata}
                  />
                  <div className="selected__book--sub-title">
                    {item.subTitle}
                  </div>
                  <div className="selected__book--line"></div>
                  <div className="selected__book--content">
                    <figure
                      className="book__image--wrapper"
                      style={{ height: 140, width: 140, minWidth: 140 }}
                    >
                      <img
                        className="book__image"
                        src={item?.imageLink}
                        alt="The Lean Start Up"
                      />
                    </figure>
                    <div className="selected__book--text">
                      <div className="selected__book--title">{item?.title}</div>
                      <div className="selected__book--author">
                        {item?.author}
                      </div>
                      <div className="selected__book--duration-wrapper">
                        <div className="selected__book--icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 16 16"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                          </svg>
                        </div>
                        <div className="selected__book--duration">
                          {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}

            <div>
              <div className="for-you__title">Recommended For You</div>
              <div className="for-you__sub--title">
                We think you'll like these
              </div>
              {recommendedLoading ? (
                <div className="for-you__recommended--books">
                    {new Array(8).fill(0).map((_, index) => (
                    <a key={index} className="for-you__recommended--books-link">
                      <figure
                        className="book__image--wrapper"
                        style={{ marginBottom: "8px" }}
                      >
                        <div
                          className="skeleton"
                          style={{ display: "block", height: "172px" }}
                        />
                      </figure>
                      <div className="recommended__book--title">
                        <Skeleton
                          display="flex"
                          height="19.33px"
                          width="172px"
                        />
                      </div>
                      <div className="recommended__book--author">
                        <Skeleton
                          display="flex"
                          height="16.67px"
                          width="168px"
                        />
                      </div>
                      <div className="recommended__book--sub-title">
                        <Skeleton
                          display="flex"
                          height="33.33px"
                          width="160px"
                        />
                      </div>
                      <div className="recommended__book--details-wrapper">
                        <Skeleton
                          display="flex"
                          height="16.67px"
                          width="168px"
                        />
                      </div>
                    </a>
                  ))}
                  </div>
              ) : (
                <div className="for-you__recommended--books">
                  {recommended?.map((Book: book) => (
                    <RecommendedBooks key={Book.id} {...Book} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="for-you__title">Suggested Books</div>
              <div className="for-you__sub--title">Browse those books</div>
               {suggestedLoading ? (
                 <div className="for-you__recommended--books">
                 {new Array(8).fill(0).map((_, index) => (
                    <a key={index} className="for-you__recommended--books-link">
                      <figure
                        className="book__image--wrapper"
                        style={{ marginBottom: "8px" }}
                      >
                        <div
                          className="skeleton"
                          style={{ display: "block", height: "172px" }}
                        />
                      </figure>
                      <div className="recommended__book--title">
                        <Skeleton
                          display="flex"
                          height="19.33px"
                          width="172px"
                        />
                      </div>
                      <div className="recommended__book--author">
                        <Skeleton
                          display="flex"
                          height="16.67px"
                          width="168px"
                        />
                      </div>
                      <div className="recommended__book--sub-title">
                        <Skeleton
                          display="flex"
                          height="33.33px"
                          width="160px"
                        />
                      </div>
                      <div className="recommended__book--details-wrapper">
                        <Skeleton
                          display="flex"
                          height="16.67px"
                          width="168px"
                        />
                      </div>
                    </a>
                ))}
                  </div>
                ) : (
              <div className="for-you__recommended--books">
                {suggested?.map((Book: book) => (
                  <SuggestedBooks key={Book.id} {...Book} />
                ))}
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forYouPage;
