import { logInfo } from "./../Config/logging";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { config } from "../Config/config";

const API_URL = config.server.hostname + ":" + config.server.port + "/api/test";

export const test = async ( req: Request, res: Response ): Promise<void> => {
    logInfo( "TEST API", "Request Recieved!");
    res.status( StatusCodes.OK ).send( { data: ("" + API_URL + req.url) } );
};