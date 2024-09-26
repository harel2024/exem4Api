import axios from "axios";
import { Book } from "../models/types.js";
import { v4 as uuidv4 } from "uuid";



// export const addBookFromApi= async (bookName: string): Promise<Book> => {

//     const response = await axios.get(`https://freetestapi.com/api/v1/books?search=${bookName}`);
//     const book : Book = {
//         title:bookName,
//         author: response.data[0].author,
//         id: uuidv4()
//     }

//     return book
// }







export const addBookFromApi = async (bookName: string): Promise<Book> => {
    // פונקציה אסינכרונית שמקבלת את שם הספר ומחזירה אובייקט מסוג Book
    
    // שליחת בקשת GET ל-API חיצוני כדי לחפש ספרים לפי שם הספר שנשלח כפרמטר
    const response = await axios.get(`https://freetestapi.com/api/v1/books?search=${bookName}`);
    
    // יצירת אובייקט ספר חדש עם השדות: כותרת (bookName), מחבר (מתוך התגובה מה-API), ו-ID ייחודי (שנוצר עם uuidv4)
    const book: Book = {
        title: bookName,                  // כותרת הספר שהתקבלה בפרמטר
        author: response.data[0].author,  // שם המחבר שמתקבל מתוך תגובת ה-API (הספר הראשון בתוצאות)
        id: uuidv4()                      // יצירת מזהה ייחודי חדש לספר באמצעות uuidv4
    }
    
    // החזרת אובייקט הספר שנוצר
    return book;
}

/*
סיכום:
- הקוד שולח בקשה ל-API חיצוני כדי לחפש ספרים לפי שם הספר.
- הוא לוקח את המחבר של התוצאה הראשונה שמתקבלת מה-API ויוצר אובייקט ספר חדש.
- האובייקט מכיל כותרת, שם מחבר, ומזהה ייחודי שנוצר עם uuidv4.
- בסופו של דבר הפונקציה מחזירה את אובייקט הספר שנוצר.
*/



