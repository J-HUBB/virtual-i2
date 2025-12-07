"use client";

import RecommendedBooks from "@/components/RecommendbooksCard";
import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import SuggestedBooks from "@/components/SuggestedbooksCard";
import { useGetOneBookQuery, book, useGetRecomendedBooksQuery, useGetSuggestedBooksQuery} from "@/Redux/booksSlice";

const forYouPage = () => {
  const { data: books, isLoading: booksLoading, isError: booksError } = useGetOneBookQuery();
  const { data: Recommended, isLoading: recommededLoading, isError: recommededError } = useGetRecomendedBooksQuery();
  const { data: Suggested, isLoading: suggestedLoading, isError: suggestedError } = useGetSuggestedBooksQuery();
 
  
  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="row">
        <div className="container">
          <div className="for-you__wrapper">
            <div className="for-you__title">Selected just for you</div>
            <audio src="/"></audio>
            <>
              {books?.map((item: book) => (
                <a key={item.id} className="selected__book" href="">
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
                        src={item.imageLink}
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
                          5 mins 25 secs
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </>

            <div>
              <div className="for-you__title">Recommended For You</div>
              <div className="for-you__sub--title">
                We think you'll like these
              </div>
              <div className="for-you__recommended--books">
                {Recommended?.map((Book: book) => (
                  <RecommendedBooks key={Book.id} {...Book} />
                ))}
              </div>
            </div>

            <div>
              <div className="for-you__title">Suggested Books</div>
              <div className="for-you__sub--title">Browse those books</div>
              <div className="for-you__recommended--books">
                {Suggested?.map((Book: book) => (
                  <SuggestedBooks key={Book.id} {...Book} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forYouPage;
