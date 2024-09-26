var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BeeperStatus } from "../models/types.js";
import { readBeepersFromJsonFile, writeAllToJsonFile } from "../DAL/jsonBeepers.js";
import { v4 as uuidv4 } from 'uuid';
//GET
export const getAllBeepers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeepersFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//POST
export const createBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const newBeeper = {
            id: uuidv4(),
            name: name,
            status: BeeperStatus.manufactured,
            created_at: new Date(),
            detonated_at: null,
            latitude: 0,
            longitude: 0
        };
        const beepers = yield readBeepersFromJsonFile();
        beepers.push(newBeeper);
        yield writeAllToJsonFile(beepers);
        res.status(201).json(newBeeper);
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
//GET BY ID
export const getBeeperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const beepers = yield readBeepersFromJsonFile();
        const beeper = beepers.find(b => b.id === id);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        res.status(200).json(beeper);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//DELETE
export const deleteBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const beepers = yield readBeepersFromJsonFile();
        const index = beepers.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        }
        beepers.splice(index, 1);
        yield writeAllToJsonFile(beepers);
        res.status(200).json({ id: id });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//GER BY STATUS
export const getBeeperByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.params.status;
        const beepers = yield readBeepersFromJsonFile();
        const beeper = beepers.filter(b => b.status === status);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        res.status(200).json(beeper);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
export const updateBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const beepers = yield readBeepersFromJsonFile();
        const index = beepers.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        }
        beepers[index] = req.body;
        yield writeAllToJsonFile(beepers);
        res.status(200).json(beepers[index]);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// export const updateBook  = async (req: Request, res: Response) => {
//     try {
//         console.log("enter to funcation")
//         const userId: string = req.body.userId.trim();
//         const bookId: string = req.params.id.trim();
//         const users: User[] = await readUserFromJsonFile();
//         const user: User | undefined = users.find(u => u.id === userId);
//         if (!user) {    
//             console.log(`User with ID ${userId} not found`);
//             return res.status(404).send('User not found');
//         }
//         const book: Book | undefined = user.books!.find(b => b.id === bookId);
//         if (!book) {
//             console.log(`Book with ID ${bookId} not found`);
//             return res.status(404).send('Book not found');
//         }
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
