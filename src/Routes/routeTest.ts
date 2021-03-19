import express from "express";
import { test } from "../Controllers/apiTest";

export const TestRoutes = express.Router();
TestRoutes.get("/", test );
