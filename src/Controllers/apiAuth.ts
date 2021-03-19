import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const login = async ( req: Request, res: Response ): Promise<void> => {
    res.status( StatusCodes.NOT_IMPLEMENTED ).send( { data: "Not Implemented!" } );
};