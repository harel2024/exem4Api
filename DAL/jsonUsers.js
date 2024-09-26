var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jsonfile from 'jsonfile';
const file = './data/db.json';
export const witeFileToUserJson = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield jsonfile.readFile('./data/db.json');
        users.push(user);
        yield jsonfile.writeFile('./data/db.json', users);
    }
    catch (error) {
        console.error('Error writing user to JSON file:', error);
    }
});
// פונקציה לקריאה מקובץ JSON
export const readUserFromJsonFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield jsonfile.readFile(file);
    return users;
});
export const writeAllToJsonFile = (users) => __awaiter(void 0, void 0, void 0, function* () {
    yield jsonfile.writeFile(file, users, { spaces: 2 });
});
