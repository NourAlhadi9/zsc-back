import { Request, Response, NextFunction } from "express";
import { logInfo } from "../Config/logging";


/** Log the request */
export const logRequest = ( NAMESPACE: string ) => {
    return ( (req: Request, res: Response, next: NextFunction): Response|void => {
        /** Log the req */
        logInfo(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    
        res.on( "finish", () => {
            /** Log the res */
            logInfo(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });
        
        next();
    });
};