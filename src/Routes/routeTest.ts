import { authMiddleware } from './../Middlewares/auth-middleware';
import express from "express";
import { test, testAuth } from "../Controllers/apiTest";

export const TestRoutes = express.Router();
TestRoutes.get("/", test );
TestRoutes.get("/auth", authMiddleware, testAuth);
