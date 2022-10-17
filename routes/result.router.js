import { Router } from "express";
import { getRanking, getUserUrls } from "../controllers/result.controller.js";

const resultRouter = Router();

resultRouter.get('/users/me', getUserUrls);
resultRouter.get('/ranking', getRanking);


export default resultRouter;