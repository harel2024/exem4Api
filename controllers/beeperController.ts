import  e, { Request, Response } from "express";
import { Beeper } from "../models/types.js";
import {  BeeperStatus} from "../models/types.js";
import { readBeepersFromJsonFile , writeAllToJsonFile} from "../DAL/jsonBeepers.js";
import { v4 as uuidv4 } from 'uuid';
import {Latitude,Longitude,catchLocation} from "../services/location.js"





//GET
export const getAllBeepers = async (req: Request, res: Response) => {
    try {
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        res.status(200).json(beepers);
    }
    catch (error) {
        res.status(500).send(error);
    }
}





//POST
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



//GET BY ID
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



//DELETE
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



//GER BY STATUS
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




export const updateStatusBeeper = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const latitude: Number = req.body.latitude;
        const longitude: Number = req.body.longitude;
        const beepers: Beeper[] = await readBeepersFromJsonFile();
        const index: number = beepers.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).send('Beeper not found');
            return;
        }
        if (beepers[index].status === BeeperStatus.detonated) {
            res.status(400).send('Beeper is already detonated');
            return;
        }

        await handleBeeperStatusChange(beepers[index], res);
        await writeAllToJsonFile(beepers); 

        res.status(200).json(beepers[index]);
    } catch (error) {
        res.status(500).send(error);
    }
}

// פונקציה נפרדת לטיפול בשינוי הסטטוס
const handleBeeperStatusChange = async (beeper: Beeper,res: Response): Promise<void> => {
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
                 
            await new Promise(resolve => setTimeout(resolve, 10000));
            beeper.status = BeeperStatus.detonated;beeper.name = 'kiled',beeper.detonated_at = new Date();
            break;
        case BeeperStatus.deployed:
          
          beeper.status = BeeperStatus.detonated;
           
            break;
        case BeeperStatus.detonated:
            beeper.status = BeeperStatus.detonated;
            res.status(200).send("Beeper is killed");
            break;
    }
};






    







