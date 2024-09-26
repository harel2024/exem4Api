import  e, { Request, Response } from "express";
import { Beeper } from "../models/types.js";
import {  BeeperStatus} from "../models/types.js";
import { readBeepersFromJsonFile , writeAllToJsonFile} from "../DAL/jsonBeepers.js";
import { v4 as uuidv4 } from 'uuid';
import {handleBeeperStatusChange} from "../services/beefeServis.js"





// קבלת כל הביפרים
export const getAllBeepers = async (req: Request, res: Response) => {
    try {
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (error) {
        res.status(500).send(error);
    }
}





//יצירת ביפר חדש
export const createBeeper = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name;
        const newBeeper: Beeper = {
            id: uuidv4(),
            name: name,
            status: BeeperStatus.manufactured,
            created_at: new Date(),
            detonated_at: null,
            latitude: 0,
            longitude: 0
        };
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        beepers.push(newBeeper);
        await writeAllToJsonFile(beepers);
        res.status(201).json(newBeeper);
    }
    catch (error) {
        res.status(500).send('Internal Server Error');
    }
}



//קבלת ביפר ספציפי
export const getBeeperById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        const beeper: Beeper | undefined = beepers.find(b => b.id === id);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        res.status(200).json(beeper);
    }
    catch (error) {
        res.status(500).send(error);
    }
}





//מחיקת ביפר
export const deleteBeeper = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        const index: number = beepers.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        }
        beepers.splice(index, 1);
        await writeAllToJsonFile(beepers);
        res.status(200).json({ id: id });
    }
    catch (error) {
        res.status(500).send(error);
    }
}



//קבלת ביפרים לפי סטטוס
export const getBeeperByStatus = async (req: Request, res: Response) => {
    try {
        const status: string = req.params.status;
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        const beeper: Beeper[] = beepers.filter(b => b.status === status);
        if (!beeper) {
            res.status(404).send('Beeper not found');
            return;
        }
        res.status(200).json(beeper);
    }
    catch (error) {
        res.status(500).send(error);
    }
}



//עדכון סטטוס ביפר
export const updateStatusBeeper = async (req: Request, res: Response ) => {
    try {
        const id: string = req.params.id;
        const latitude: number = req.body.latitude;
        const longitude: number = req.body.longitude;
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        const index: number = beepers.findIndex(b => b.id === id);
        //אם לא קיים יחזיר שגיאה
        if (index === -1) { res.status(404).send('Beeper not found');           
            return;
        }//אם כבר התפוצץ יחזיר שגיאה
        if (beepers[index].status === BeeperStatus.detonated) {
            res.status(400).send('Beeper is already detonated');
            return;
        }

        await handleBeeperStatusChange(beepers[index],req, res);
        await writeAllToJsonFile(beepers); 

        res.status(200).json(beepers[index]);
    } catch (error) {
        res.status(500).send(error);
    }
}








    







