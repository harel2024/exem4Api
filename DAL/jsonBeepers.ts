import jsonfile from 'jsonfile';
import { Beeper } from '../models/types.js';

const file = './data/db.json';





//קריאה מקובץ גייסון
export const readBeepersFromJsonFile = async (): Promise<Beeper[]> => { 
    
    const beepers: Beeper[] = await jsonfile.readFile(file); 
    return beepers;
   
};

          

//פונקציה לכתיבה לקובץ
export const writeAllToJsonFile = async (beepers: Beeper[]) => {
    await jsonfile.writeFile(file, beepers, { spaces: 2 });
}