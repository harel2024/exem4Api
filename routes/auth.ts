import express, { Router } from 'express';
import { login, register } from '../controllers/authcontroller.js';
import { getAllBooks, addBook, updateBook, deleteBook } from '../controllers/bookControiier.js';

const router: Router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);

router.route("/books").get(getAllBooks);
router.route("/books").post(addBook);
router.route("/books/:id").put(updateBook);
router.route("/books/:id").delete(deleteBook);



export default router;