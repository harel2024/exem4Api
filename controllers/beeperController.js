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
import { handleBeeperStatusChange } from "../services/beefeServis.js";
// קבלת כל הביפרים
export const getAllBeepers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readBeepersFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
//יצירת ביפר חדש
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
//קבלת ביפר ספציפי
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
//מחיקת ביפר
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
//קבלת ביפרים לפי סטטוס
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
//עדכון סטטוס ביפר
export const updateStatusBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const beepers = yield readBeepersFromJsonFile();
        const index = beepers.findIndex(b => b.id === id);
        //אם לא קיים יחזיר שגיאה
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        } //אם כבר התפוצץ יחזיר שגיאה
        if (beepers[index].status === BeeperStatus.detonated) {
            res.status(400).send('Beeper is already detonated');
            return;
        }
        yield handleBeeperStatusChange(beepers[index], req, res);
        yield writeAllToJsonFile(beepers);
        res.status(200).json(beepers[index]);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
