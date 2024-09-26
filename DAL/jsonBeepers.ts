import jsonfile from 'jsonfile';
import { Beeper,BeeperStatus } from '../models/types.js';


const file = './data/db.json';




export const witeFileToBeeperJson = async (beeper: Beeper) => {
    try {
      const beepers: Beeper[] = await jsonfile.readFile('./data/db.json');
      beepers.push(beeper);
      await jsonfile.writeFile('./data/db.json', beepers);
    } catch (error) {
      console.error('Error writing Beeper to JSON file:', error);
    }
  };

// פונקציה לקריאה מקובץ JSON
export const readBeepersFromJsonFile = async (): Promise<Beeper[]> => { 
    
    const beepers: Beeper[] = await jsonfile.readFile(file); 
    return beepers;
   
};

          


export const writeAllToJsonFile = async (beepers: Beeper[]) => {
    await jsonfile.writeFile(file, beepers, { spaces: 2 });
}