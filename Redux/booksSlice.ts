import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface book {
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
        baseUrl: "https://us-central1-summaristt.cloudfunctions.net/"
    }),
    endpoints: (builder) => ({
        getAllBooks: builder.query<book, string>({
            query: () => "getBooks?status=selected"
        })

    })
});

export const {useGetAllBooksQuery} = booksApi