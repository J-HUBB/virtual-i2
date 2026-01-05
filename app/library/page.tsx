"use client";

import BookCard from "@/components/BookCard";
import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import Skeleton from "@/components/SkeletonLoading";
import { db } from "@/firebase";
import { useGetBookByIdQuery } from "@/Redux/booksSlice";
import { RootState } from "@/Redux/store";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Library = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { id } = useParams<{ id: string }>();
  const [books, setBooks] = useState<any[]>([]);

  const {
    data: book,
    isLoading: booksLoading,
    isError: booksError,
  } = useGetBookByIdQuery(id);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "users", user.uid, "library"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.log("Listener detached safely on logout.");
      } else {
        console.error("Firestore error:", error);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const readingBooks = books.filter((b) => b.status === "reading");
  const finishedBooks = books.filter((b) => b.status === "finished");

  const totalSavedCount = readingBooks.length;
  const finishedCount = finishedBooks.length;

  const formatCount = (count: number) =>
    `${count} ${count === 1 ? "item" : "items"}`;

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="row">
        <div className="container">
          <div className="for-you__title">Saved Books</div>
          {booksLoading ? (
            <>
              <div className="for-you__sub--title">
                <Skeleton width={"90px"} height={"19px"} display={"block"} />
              </div>
              <a
                className="for-you__recommended--books-link"
                href="/book/2l0idxm1rvw"
              >
                {/* <audio
                  src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fcan't-hurt-me.mp3?alt=media&amp;token=7de57406-60ca-49d6-9113-857507f48312"
                  preload="metadata"
                ></audio> */}
                <figure
                  className="book__image--wrapper"
                  style={{ marginBottom: "8px" }}
                >
                  <Skeleton
                    width={"172px"}
                    height={"172px"}
                    display={"block"}
                  />
                </figure>
                <div className="recommended__book--title">
                  <Skeleton
                    width={"176px"}
                    height={"19.33px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--author">
                  <Skeleton
                    width={"168px"}
                    height={"16.67px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--sub-title">
                  <Skeleton
                    width={"160px"}
                    height={"33.33px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--details-wrapper">
                  <Skeleton
                    width={"168px"}
                    height={"16.67px"}
                    display={"block"}
                  />
                </div>
              </a>
            </>
          ) : (
            <>
              <div className="for-you__sub--title">
                {formatCount(totalSavedCount)}
              </div>
              <div className="for-you__recommended--books">
                {readingBooks.map((book) => (
                  <BookCard key={book?.id} {...book} />
                ))}
              </div>
            </>
          )}
          <div className="for-you__title">Finished</div>
          {booksLoading ? (
            <>
              <div className="for-you__sub--title">
                <Skeleton width={"90px"} height={"19px"} display={"block"} />
              </div>
              <a
                className="for-you__recommended--books-link"
                href="/book/2l0idxm1rvw"
              >
                {/* <audio
                  src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fcan't-hurt-me.mp3?alt=media&amp;token=7de57406-60ca-49d6-9113-857507f48312"
                  preload="metadata"
                ></audio> */}
                <figure
                  className="book__image--wrapper"
                  style={{ marginBottom: "8px" }}
                >
                  <Skeleton
                    width={"172px"}
                    height={"172px"}
                    display={"block"}
                  />
                </figure>
                <div className="recommended__book--title">
                  <Skeleton
                    width={"176px"}
                    height={"19.33px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--author">
                  <Skeleton
                    width={"168px"}
                    height={"16.67px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--sub-title">
                  <Skeleton
                    width={"160px"}
                    height={"33.33px"}
                    display={"block"}
                  />
                </div>
                <div className="recommended__book--details-wrapper">
                  <Skeleton
                    width={"168px"}
                    height={"16.67px"}
                    display={"block"}
                  />
                </div>
              </a>
            </>
          ) : (
            <>
              <div className="for-you__sub--title">
                {formatCount(finishedCount)}
              </div>
              <div className="for-you__recommended--books">
                {finishedBooks.map((book) => (
                  <BookCard key={book?.id} {...book} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
