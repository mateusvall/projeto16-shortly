import { Router } from "express";
import { getUrl, openUrl, urlsShorten } from "../controllers/urls.controller.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', urlsShorten);
urlsRouter.get('/urls/:id', getUrl);
urlsRouter.get('/urls/open/:shortUrl', openUrl);

export default urlsRouter;

