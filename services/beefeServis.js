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
// פונקציה לטיפול במיקום
export function catchLocation(latitude, longitude) {
    const lat = Latitude.indexOf(latitude);
    const long = Longitude.indexOf(longitude);
    if (lat < 0 || long < 0 || lat != long) {
        return false;
    }
    else {
        return true;
    }
}
// פונקציה נפרדת  לשינוי הסטטוס
export const handleBeeperStatusChange = (beeper, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (beeper.status) {
        case BeeperStatus.manufactured:
            beeper.status = BeeperStatus.assembled;
            break;
        case BeeperStatus.assembled:
            beeper.status = BeeperStatus.shipped;
            break;
        case BeeperStatus.shipped:
            if (!catchLocation(req.body.latitude, req.body.longitude)) { //קריאה לפונקציה לבדיקת מיקום
                res.status(400).send("Beeper is not in the right location");
                break;
            }
            beeper.status = BeeperStatus.deployed;
            yield new Promise((resolve) => setTimeout(resolve, 10000)); //  מחכה 10 שניות לשינוי הסטטוס ומעדכן
            beeper.status = BeeperStatus.detonated;
            (beeper.name = ` ${beeper.name} kiled`), (beeper.detonated_at = new Date()),
                beeper.latitude = req.body.latitude, beeper.longitude = req.body.longitude;
            break;
    }
});
// מערך המיקומים
export const Latitude = [
    34.59708, 33.72141, 33.5089, 33.6838, 33.68535, 34.0771, 33.7846, 34.50491,
    34.6793, 33.25026, 34.36202, 33.42607, 34.48697, 33.35128, 34.65033, 34.67662,
    33.35875, 33.12274, 33.79351, 33.92002, 33.83706, 34.53059, 34.18524,
    33.92894, 34.57897, 33.8968, 34.28723, 33.9799, 33.68114, 34.53243, 34.07938,
    34.59343, 33.83205, 34.42701, 34.63897, 34.41031, 34.39869, 33.01048,
    33.75823, 33.77224, 34.3657, 34.52543, 33.34957, 34.27838, 33.77564, 33.67021,
    34.63734, 34.31768, 33.62269, 34.34499,
];
//מערך מיקומים
export const Longitude = [
    35.78674, 36.59793, 35.85089, 36.11096, 35.20427, 36.55406, 35.43539,
    36.39218, 36.58335, 35.9977, 35.08479, 35.13643, 36.32015, 36.13825, 36.13545,
    35.35375, 35.13752, 35.91729, 36.42971, 36.31603, 35.75151, 35.39202,
    36.28982, 36.34516, 36.07131, 35.42969, 35.09238, 35.36946, 35.45531,
    35.82878, 35.95813, 35.1033, 35.176, 35.49997, 36.58622, 35.76916, 35.65177,
    35.36257, 36.38592, 36.3063, 35.19468, 36.57411, 35.37663, 35.04438, 35.87574,
    36.29989, 35.27868, 35.7885, 36.46484, 35.38508,
];
