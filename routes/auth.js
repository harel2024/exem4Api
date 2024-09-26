import Express from "express";
import { createBeeper, deleteBeeper, getBeeperById, getBeeperByStatus, getAllBeepers, updateStatusBeeper } from "../controllers/beeperController.js";
const router = Express.Router();
router.route("/").post(createBeeper);
router.route("/").get(getAllBeepers);
router.route("/:id").get(getBeeperById);
router.route("/:id/status").put(updateStatusBeeper);
router.route("/:id").delete(deleteBeeper);
router.route("/status/:status").get(getBeeperByStatus);
export default router;
