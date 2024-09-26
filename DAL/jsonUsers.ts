import jsonfile from 'jsonfile';
import { User } from '../models/types.js';


const file = './data/db.json';




export const witeFileToUserJson = async (user: User) => {
    try {
      const users: User[] = await jsonfile.readFile('./data/db.json');
      users.push(user);
      await jsonfile.writeFile('./data/db.json', users);
    } catch (error) {
      console.error('Error writing user to JSON file:', error);
    }
  };

// פונקציה לקריאה מקובץ JSON
export const readUserFromJsonFile = async (): Promise<User[]> => { 
    
    const users: User[] = await jsonfile.readFile(file); 
    return users;
   
};
          


export const writeAllToJsonFile = async (users: User[]) => {
    await jsonfile.writeFile(file, users, { spaces: 2 });
}