"use client";

import {
  useGetBookByAuthorOrTitleQuery,
  book,
  useGetOneBookQuery,
} from "@/Redux/booksSlice";
import { useEffect, useRef, useState } from "react";
import BookCard from "./BookCard";

const Searchbar = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: books,
    isLoading: booksLoading,
    isError: booksError,
  } = useGetBookByAuthorOrTitleQuery(debouncedSearchTerm, {
    skip: debouncedSearchTerm.length < 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const bookResults = searchTerm.length > 0;

  return (
    <div className="search__background">
      <div className="search__wrapper">
        <figure>
          <img src="logo" alt="" />
        </figure>
        <div className="search__content">
          <div className="search">
            <div className="search__input--wrapper">
              <input
                className="search__input"
                placeholder="Search for books"
                type="text"
                value={searchTerm}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
              />
              <div className="search__icon">
                {searchTerm.length > 0 ? (
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    className="search__delete--icon"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleClearSearch}
                  >
                    <path
                      d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 1024 1024"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="sidebar__toggle--btn">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 15 15"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
        {isOpen && searchTerm.length > 0 && (booksLoading || books) && (
          <div ref={searchContainerRef} className="search__books--wrapper">
            {booksLoading ? (
              <div
                className="skeleton"
                style={{ width: "100%", height: "120px", marginBottom: "8px", backgroundColor: "light-gray" }}
              />
            ) : books?.length > 0 ? (
              books?.map((Book: book) => <BookCard key={Book.id} {...Book} />)
            ) : (
              <p>No book found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
