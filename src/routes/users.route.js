import express from "express";
import {prisma} from "../lib/utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();


export default router;
