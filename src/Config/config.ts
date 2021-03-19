import dotenv from "dotenv";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 9996;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

export const config = {
    server: SERVER
};
