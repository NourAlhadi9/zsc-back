import express from "express";
import { login } from "../Controllers/apiAuth";


export const AuthRoutes = express.Router();
AuthRoutes.get("/login", login );
