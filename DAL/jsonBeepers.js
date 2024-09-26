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
export const witeFileToBeeperJson = (beeper) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield jsonfile.readFile('./data/db.json');
        beepers.push(beeper);
        yield jsonfile.writeFile('./data/db.json', beepers);
    }
    catch (error) {
        console.error('Error writing Beeper to JSON file:', error);
    }
});
// פונקציה לקריאה מקובץ JSON
export const readBeepersFromJsonFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const beepers = yield jsonfile.readFile(file);
    return beepers;
});
export const writeAllToJsonFile = (beepers) => __awaiter(void 0, void 0, void 0, function* () {
    yield jsonfile.writeFile(file, beepers, { spaces: 2 });
});
