import { Request, Response, NextFunction } from "express";
import StatusCodes from "http-status-codes";

export const apiRules = ( req: Request, res:Response, next: NextFunction ):Response|undefined => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization" );

    if ( req.method == "OPTIONS" ) {
        res.header( "Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET" );
        return res.status( StatusCodes.OK ).json( {} );
    }

    next();
};