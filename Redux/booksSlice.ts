import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface book {
  data: any;
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: string;
  averageRating: string;
  keyIdeas: string;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string;
  bookDescription: string;
  authorDescription: string;
}

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://us-central1-summaristt.cloudfunctions.net/",
  }),
  endpoints: (builder) => ({
    getOneBook: builder.query<book[], void>({
      query: () => "getBooks?status=selected",
    }),
    getRecomendedBooks: builder.query<book[], void>({
      query: () => "getBooks?status=recommended",
    }),
    getSuggestedBooks: builder.query<book[], void>({
      query: () => "getBooks?status=suggested",
    }),
    getBookById: builder.query<book, string | boolean>({
      query: (id) => `getBook?id=${id}`
    }),
    getBookByAuthorOrTitle: builder.query<book[], void>({
      query: (search) => `getBooksByAuthorOrTitle?search=${search}`
    })
  }),
});

export const { useGetOneBookQuery, useGetRecomendedBooksQuery, useGetSuggestedBooksQuery, useGetBookByIdQuery, useGetBookByAuthorOrTitleQuery } = booksApi;
