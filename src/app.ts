import http from "http";
import { StatusCodes } from "http-status-codes";
import { json as BodyParserJSON, urlencoded as BodyParserURLEncoded } from "body-parser";
import express from "express";
import { config } from "./Config/config";
import { logInfo } from "./Config/logging";
import { logRequest } from "./Middlewares/logger-middleware";
import { apiRules } from "./Middlewares/api-rules-middleware";
import { TestRoutes } from "./Routes/routeTest";

const NAMESPACE = "Server";
const router = express();

/** Log the request */
router.use( logRequest( NAMESPACE ) );

/** Parse the body of the request */
router.use( BodyParserURLEncoded({ extended: true }) );
router.use( BodyParserJSON() );

/** Rules of our API */
router.use( apiRules );

/** Routes go here */
router.use("/api/test", TestRoutes);

/** Error handling */
router.use( ( req, res ) => {
    const error = new Error("Not found");

    res.status( StatusCodes.OK ).json( {
        message: error.message
    } );
} );

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logInfo(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));