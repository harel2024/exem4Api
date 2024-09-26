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
import { catchLocation } from "../services/location.js";
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
export const updateStatusBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const beepers = yield readBeepersFromJsonFile();
        const index = beepers.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        }
        if (beepers[index].status === BeeperStatus.detonated) {
            res.status(400).send('Beeper is already detonated');
            return;
        }
        yield handleBeeperStatusChange(beepers[index], res);
        yield writeAllToJsonFile(beepers);
        res.status(200).json(beepers[index]);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
// פונקציה נפרדת לטיפול בשינוי הסטטוס
const handleBeeperStatusChange = (beeper, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (beeper.status) {
        case BeeperStatus.manufactured:
            beeper.status = BeeperStatus.assembled;
            break;
        case BeeperStatus.assembled:
            beeper.status = BeeperStatus.shipped;
            break;
        case BeeperStatus.shipped:
            beeper.status = BeeperStatus.deployed;
            if (!catchLocation(beeper.latitude, beeper.longitude)) {
                res.status(400).send("Beeper is not in the right location");
            }
            yield new Promise(resolve => setTimeout(resolve, 10000));
            beeper.status = BeeperStatus.detonated;
            beeper.name = 'kiled', beeper.detonated_at = new Date();
            break;
        case BeeperStatus.deployed:
            beeper.status = BeeperStatus.detonated;
            break;
        case BeeperStatus.detonated:
            beeper.status = BeeperStatus.detonated;
            res.status(200).send("Beeper is killed");
            break;
    }
});
