import { logError } from "./logging";
import dotenv from "dotenv";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 9996;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const DATABASE_URL = process.env.DATABASE_URL || ""; // postgres://user:pass@host:port/db
let user = ( DATABASE_URL.match(/\/[a-z0-9]+:/) || [] ) [0];
let pass = ( DATABASE_URL.match(/:[a-z0-9]+@/) || [] ) [0];
let host = ( DATABASE_URL.match(/@[a-z0-9-.]+:/) || [] ) [0];
let port = ( DATABASE_URL.match(/:[0-9]+\//) || [] ) [0];
let db = ( DATABASE_URL.match(/\/[a-z0-9]+$/) || [] ) [0];

try {
    user = user.substring(1, user.length-1);
    pass = pass.substring(1, pass.length-1);
    host = host.substring(1, host.length-1);
    port = port.substring(1, port.length-1);
    db = db.substring(1, db.length);
} catch ( error ) {
    logError( "Config", error.message, error );
}

const DATABASE_HOSTNAME = process.env.DATABASE_HOSTNAME || host;
const DATABASE_DATABASE = process.env.DATABASE_DATABASE || db;
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || user;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || pass;
const DATABASE_PORT = process.env.DATABASE_PORT || port;

const DATABASE = {
    hostname: DATABASE_HOSTNAME,
    database: DATABASE_DATABASE,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    url: DATABASE_URL
};

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || 'mysuperduperdummysecret123456789';
const ENCRYPTION_ROUNDS = process.env.ENCRYPTION_ROUNDS || 10;

export const config = {
    server: SERVER,
    database: DATABASE,
    jwtTokenSecret: JWT_TOKEN_SECRET,
    encryptionRounds: ENCRYPTION_ROUNDS
};
