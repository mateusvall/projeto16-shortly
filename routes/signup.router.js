import { Router } from "express";
import { signIn, signUp } from "../controllers/signup.controller.js";

const signUpRouter = Router();

signUpRouter.post('/signup', signUp)
signUpRouter.post('/signin', signIn)

export default signUpRouter;