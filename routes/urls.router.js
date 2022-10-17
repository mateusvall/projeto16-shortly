import { Router } from "express";
import { getUrl, urlsShorten } from "../controllers/urls.controller.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', urlsShorten);
urlsRouter.get('/urls/:id', getUrl);

export default urlsRouter;

