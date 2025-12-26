"use client"

import BookCard from "@/components/BookCard";
import Searchbar from "@/components/Searchbar";
import Sidebar from "@/components/Sidebar";
import { db } from "@/firebase";
import { useGetBookByIdQuery } from "@/Redux/booksSlice";
import { RootState } from "@/Redux/store";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'library'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        setBooks(snapshot.docs.map(doc => ({id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const reading = books.filter(b => b.status === 'reading');
  const finished = books.filter(b => b.status === 'finished');

  const totalSaved = books.length;
  const finishedBooks = books.filter(b => b.status === 'finished');
  const finishedCount = finishedBooks.length;

  const formatCount = (count: number) => `${count} ${count === 1 ? 'item' : 'items'}`;

  return (
    <div className="wrapper">
      <Searchbar />
      <Sidebar />
      <div className="row">
        <div className="container">
          <div className="for-you__title">Saved Books</div>
          <div className="for-you__sub--title">{formatCount(totalSaved)}{/*3 items*/}</div>
          <div className="for-you__recommended--books">
            {/* <a
              className="for-you__recommended--books-link"
              href="/book/2ozpy1q1pbt"
            >
              <audio src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-intelligent-investor.mp3?alt=media&amp;token=82429bb8-8af4-4375-bca5-e6f89e631fca"></audio>
              <figure
                className="book__image--wrapper"
                style={{marginBottom: "8px"}}
              >
                <img
                  className="book__image"
                  src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-intelligent-investor.png?alt=media&amp;token=f72f1865-de93-4c67-bd6e-55070f467923"
                  alt="book"
                  style={{display: "block"}}
                />
              </figure>
              <div className="recommended__book--title">
                The Intelligent Investor
              </div>
              <div className="recommended__book--author">Benjamin Graham</div>
              <div className="recommended__book--sub-title">
                The Definitive Book on Value Investing
              </div>
              <div className="recommended__book--details-wrapper">
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
                  <div className="recommended__book--details-text">02:48</div>
                </div>
                <div className="recommended__book--details">
                  <div className="recommended__book--details-icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                    </svg>
                  </div>
                  <div className="recommended__book--details-text">4.8</div>
                </div>
              </div>
            </a> */}
            {reading.map(book =>
            <BookCard key={book?.id} {...book} />)}
          </div>
          <div className="for-you__title">Finished</div>
          <div className="for-you__sub--title">{formatCount(finishedCount)}{/*13 items*/}</div>
          <div className="for-you__recommended--books">
            {/* <a
              className="for-you__recommended--books-link"
              href="/book/18tro3gle2p"
            >
              <audio src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-talk-to-anyone.mp3?alt=media&amp;token=30173e56-fbe6-4162-8184-64d24dc480ac"></audio>
              <figure
                className="book__image--wrapper"
                style={{marginBottom: "8px"}}
              >
                <img
                  className="book__image"
                  src="https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fhow-to-talk-to-anyone.png?alt=media&amp;token=48f77463-a093-42b4-8f1f-82fa4edd044c"
                  alt="book"
                  style={{display: "block"}}
                />
              </figure>
              <div className="recommended__book--title">
                How to Talk to Anyone
              </div>
              <div className="recommended__book--author">Leil Lowndes</div>
              <div className="recommended__book--sub-title">
                92 Little Tricks for Big Success in Relationships
              </div>
              <div className="recommended__book--details-wrapper">
                <div className="recommended__book--details">
                  <div className="recommended__book--details-icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                      <path d="M13 7h-2v6h6v-2h-4z"></path>
                    </svg>
                  </div>
                  <div className="recommended__book--details-text">03:22</div>
                </div>
                <div className="recommended__book--details">
                  <div className="recommended__book--details-icon">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 1024 1024"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                    </svg>
                  </div>
                  <div className="recommended__book--details-text">4.6</div>
                </div>
              </div>
            </a> */}
            {finished.map(book =>
            <BookCard key={book?.id} {...book}/>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
