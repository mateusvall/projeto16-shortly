import { Router } from "express";
import { deleteUrl, getUrl, openUrl, urlsShorten } from "../controllers/urls.controller.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', urlsShorten);
urlsRouter.get('/urls/:id', getUrl);
urlsRouter.get('/urls/open/:shortUrl', openUrl);
urlsRouter.delete('/urls/:id', deleteUrl);

export default urlsRouter;

