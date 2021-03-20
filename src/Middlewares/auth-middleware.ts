import { generateSelectQueryText } from './../Utils/sqlHelper';
import { pg } from './../Utils/pool';
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { config } from "../Config/config";
import { apiResponse } from "../Models/apiResponse";

const tokenSecret = config.jwtTokenSecret;

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    const token = req.headers.authorization;
    const blacklisted = await isBlackListed( token || '' );
    if ( !token || blacklisted ) res.status( StatusCodes.UNAUTHORIZED ).send( { status: StatusCodes.UNAUTHORIZED, message: "Token does not exist!" } as apiResponse )
    else {
        jwt.verify( token.split( " " )[1], tokenSecret, ( err, value ) => {
            if ( err ) res.status( StatusCodes.UNAUTHORIZED ).send( { status: StatusCodes.UNAUTHORIZED, message: "Invalid token provided!", data: err } as apiResponse );
            req.body.user = ( value as any ).data;
            next();
        });
    }
}

export const isBlackListed = async ( token:string ) => {
    const checkQuery = generateSelectQueryText( `public."blacklistedTokens"`, [ 'token' ] ) + `where "token"='${token}'`;
    const blacklist = ( await pg.query( checkQuery ) ).rows;
    return blacklist.length > 0;
}