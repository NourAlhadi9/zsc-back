import express from "express";
import { login, signup, logout } from "../Controllers/apiAuth";
import { authMiddleware } from '../Middlewares/auth-middleware';


export const AuthRoutes = express.Router();
AuthRoutes.post("/signup", signup );
AuthRoutes.post("/login", login);
AuthRoutes.get("/logout", authMiddleware , logout);
