import { Router } from "express";
import { getUserUrls } from "../controllers/result.controller.js";

const resultRouter = Router();

resultRouter.get('/users/me', getUserUrls);



export default resultRouter;