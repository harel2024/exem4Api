

export interface User {
        userName: string;
        password: string;
        id?: string;
        books?: Book[]
    }

 export interface Book {
       title: string;
       author: string;
       id?: string;
    }