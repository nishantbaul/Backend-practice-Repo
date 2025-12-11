import { Router, Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const Router = Router()
Router.Route("/register").post(registerUser)

export default Router