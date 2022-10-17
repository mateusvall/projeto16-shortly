import { Router } from "express";
import { urlsShorten } from "../controllers/urls.controller.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', urlsShorten)

export default urlsRouter;

