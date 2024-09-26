import  e, { Request, Response } from "express";
import { User } from "../models/types.js";
import { Book } from "../models/types.js";
import {addBookFromApi} from "../services/opeApiLib.js";
import { readUserFromJsonFile , writeAllToJsonFile} from "../DAL/jsonUsers.js";




export const getAllBooks =async (req: Request, res: Response) => { 

        if (!req.query.userid) {
            res.status(400).send({ error: 'User ID is required' });
            return;
        }
        const userid: string = req.query.userid as string;
        const users: User[] = await readUserFromJsonFile();
        const user: User = users.find(u => u.id === userid) as User;
        
        res.status(200).json(user.books)
            
    }


export const addBook = async (req: Request, res: Response) => {
    try {
        const userId: string = req.body.userId;
        const bookName: string = req.body.bookName;

        const book: Book = await addBookFromApi(bookName);
        const users: User[] = await readUserFromJsonFile();
        const user: User = users.find(u => u.id === userId) as User;

         //בדיקה שאם קיים אצל המשתמש אותו ספר שיחזיר שהספר כבר קיים
        if (user.books!.find(b => b.title.toLowerCase().trim() === book.title.toLowerCase().trim()
             && b.author.toLowerCase().trim() === book.author.toLowerCase().trim())) {
            res.status(400).send({ error: 'Book already exists' });
            return;
        }
        

        user.books!.push(book);
        await writeAllToJsonFile(users);
        res.status(201).json({ bookid: book.id });
    }
    catch (error) {
        res.status(500).send(error);
    }
}




export const updateBook  = async (req: Request, res: Response) => {
    try {
        console.log("enter to funcation")
        const userId: string = req.body.userId.trim();
        const bookId: string = req.params.id.trim();
        const users: User[] = await readUserFromJsonFile();
    

        const user: User | undefined = users.find(u => u.id === userId);
        if (!user) {    
            console.log(`User with ID ${userId} not found`);
            return res.status(404).send('User not found');
        }
     

        const book: Book | undefined = user.books!.find(b => b.id === bookId);
        if (!book) {
            console.log(`Book with ID ${bookId} not found`);
            return res.status(404).send('Book not found');
        }
       

        book.title = req.body.updatedData.title;
        book.author = req.body.updatedData.author;
        book.id = bookId;
      

        await writeAllToJsonFile(users);
        res.status(200).json({ message: 'Book updated successfully' });

    }
    catch (error) {
        res.status(500).send(error);
    }
        
}






export const deleteBook = async (req: Request, res: Response): Promise<any> => {
    try {
 
        const bookId: string = req.params.id.trim();
        const userId: string = req.body.userId.trim();
        const users: User[] = await readUserFromJsonFile();
        const user: User = users.find(u => u.id === userId) as User;
        
        const bookIndex = user.books!.findIndex(b => b.id === bookId);
        if (bookIndex === -1) {
            res.status(404).send({ error: 'Book not found' });
            return;
        }
        user.books!.splice(bookIndex, 1);
        await writeAllToJsonFile(users);
        res.status(200).json({ bookid: bookId });
    }
    catch (error) {
        res.status(500).send(error);
    }
}
// import e, { Request, Response } from "express";
// import { User } from "../models/types.js";
// import { Book } from "../models/types.js";
// import { addBookFromApi } from "../services/opeApiLib.js";
// import { readUserFromJsonFile, writeAllToJsonFile } from "../DAL/jsonUsers.js";

// // פונקציה שמחזירה את כל הספרים של משתמש מסוים לפי User ID שנשלח בשאילתא
// export const getAllBooks = async (req: Request, res: Response) => { 
//     // בדיקה אם ה-User ID קיים ב-query string של הבקשה
//     if (!req.query.userid) {
//         // אם ה-User ID לא סופק, מחזירים שגיאה עם קוד 400 (Bad Request)
//         res.status(400).send({ error: 'User ID is required' });
//         return;
//     }

//     // שליפת ה-User ID מתוך ה-query של הבקשה והמרתו למחרוזת
//     const userid: string = req.query.userid as string;

//     // קריאת כל המשתמשים מקובץ JSON
//     const users: User[] = await readUserFromJsonFile();

//     // חיפוש המשתמש הספציפי לפי ה-User ID
//     const user: User = users.find(u => u.id === userid) as User;

//     // החזרת רשימת הספרים של המשתמש שנמצא בתור JSON עם קוד 200 (OK)
//     res.status(200).json(user.books);
// }

// // פונקציה שמוסיפה ספר חדש לרשימת הספרים של משתמש מסוים
// export const addBook = async (req: Request, res: Response) => {
//     try {
//         // שליפת ה-User ID ושם הספר מתוך גוף הבקשה (request body)
//         const userId: string = req.body.userId;
//         const bookName: string = req.body.bookName;

//         // קריאה לשירות חיצוני (API) להוספת ספר חדש לפי שם הספר שהתקבל
//         const book: Book = await addBookFromApi(bookName);

//         // קריאת כל המשתמשים מקובץ JSON
//         const users: User[] = await readUserFromJsonFile();

//         // חיפוש המשתמש לפי ה-User ID שסופק
//         const user: User = users.find(u => u.id === userId) as User;

//         // בדיקה אם הספר כבר קיים אצל המשתמש על ידי השוואת שם הספר והמחבר (תוך הסרת רווחים והתעלמות מאותיות קטנות/גדולות)
//         if (user.books!.find(b => 
//             b.title.toLowerCase().trim() === book.title.toLowerCase().trim() &&
//             b.author.toLowerCase().trim() === book.author.toLowerCase().trim())) {
//             // אם הספר כבר קיים, מחזירים שגיאה עם קוד 400 (Bad Request) והודעה מתאימה
//             res.status(400).send({ error: 'Book already exists' });
//             return;
//         }

//         // אם הספר לא קיים, מוסיפים אותו לרשימת הספרים של המשתמש
//         user.books!.push(book);

//         // כותבים את כל המשתמשים המעודכנים בחזרה לקובץ JSON
//         await writeAllToJsonFile(users);

//         // מחזירים את ה-ID של הספר החדש עם קוד 201 (Created)
//         res.status(201).json({ bookid: book.id });
//     }
//     catch (error) {
//         // במקרה של שגיאה, מחזירים קוד 500 (Internal Server Error) ואת הודעת השגיאה
//         res.status(500).send(error);
//     }
// }

// // פונקציה שמעדכנת פרטים של ספר קיים ברשימת הספרים של משתמש
// export const updateBook = async (req: Request, res: Response) => {
//     try {
//         console.log("enter to function");

//         // שליפת ה-User ID וה-Book ID מתוך גוף הבקשה וה-URL (בהתאמה), והסרת רווחים עודפים
//         const userId: string = req.body.userId.trim();
//         const bookId: string = req.params.id.trim();

//         // קריאת כל המשתמשים מקובץ JSON
//         const users: User[] = await readUserFromJsonFile();

//         // חיפוש המשתמש לפי ה-User ID
//         const user: User | undefined = users.find(u => u.id === userId);
//         if (!user) {
//             // אם המשתמש לא נמצא, מחזירים הודעת שגיאה וקוד 404 (Not Found)
//             console.log(`User with ID ${userId} not found`);
//             return res.status(404).send('User not found');
//         }

//         // חיפוש הספר לפי ה-Book ID ברשימת הספרים של המשתמש
//         const book: Book | undefined = user.books!.find(b => b.id === bookId);
//         if (!book) {
//             // אם הספר לא נמצא, מחזירים הודעת שגיאה וקוד 404 (Not Found)
//             console.log(`Book with ID ${bookId} not found`);
//             return res.status(404).send('Book not found');
//         }

//         // עדכון פרטי הספר (כותרת ומחבר) עם הנתונים החדשים מהבקשה
//         book.title = req.body.updatedData.title;
//         book.author = req.body.updatedData.author;
//         book.id = bookId; // שמירה על ה-ID של הספר

//         // כתיבת כל המשתמשים המעודכנים חזרה לקובץ JSON
//         await writeAllToJsonFile(users);

//         // מחזירים הודעת הצלחה עם קוד 200 (OK)
//         res.status(200).json({ message: 'Book updated successfully' });
//     }
//     catch (error) {
//         // במקרה של שגיאה, מחזירים קוד 500 (Internal Server Error) ואת הודעת השגיאה
//         res.status(500).send(error);
//     }
// }

// // פונקציה שמוחקת ספר מרשימת הספרים של משתמש מסוים
// export const deleteBook = async (req: Request, res: Response): Promise<any> => {
//     try {
//         // שליפת ה-Book ID מתוך ה-URL וה-User ID מתוך גוף הבקשה והסרת רווחים עודפים
//         const bookId: string = req.params.id.trim();
//         const userId: string = req.body.userId.trim();

//         // קריאת כל המשתמשים מקובץ JSON
//         const users: User[] = await readUserFromJsonFile();

//         // חיפוש המשתמש לפי ה-User ID
//         const user: User = users.find(u => u.id === userId) as User;

//         // חיפוש אינדקס הספר ברשימת הספרים של המשתמש לפי ה-Book ID
//         const bookIndex = user.books!.findIndex(b => b.id === bookId);
//         if (bookIndex === -1) {
//             // אם הספר לא נמצא, מחזירים הודעת שגיאה וקוד 404 (Not Found)
//             res.status(404).send({ error: 'Book not found' });
//             return;
//         }

//         // מחיקת הספר לפי האינדקס שנמצא
//         user.books!.splice(bookIndex, 1);

//         // כתיבת כל המשתמשים המעודכנים חזרה לקובץ JSON
//         await writeAllToJsonFile(users);

//         // מחזירים את ה-ID של הספר שנמחק עם קוד 200 (OK)
//         res.status(200).json({ bookid: bookId });
//     }
//     catch (error) {
//         // במקרה של שגיאה, מחזירים קוד 500 (Internal Server Error) ואת הודעת השגיאה
//         res.status(500).send(error);
//     }
// }



