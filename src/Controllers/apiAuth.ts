import { logError, logInfo, logWarn } from './../Config/logging';
import { apiResponse } from './../Models/apiResponse';
import { generateInsertQuery, generateSelectQueryText } from './../Utils/sqlHelper';
import { pg } from './../Utils/pool';
import { User, getDefaultUser } from './../Models/user';
import { Response, Request, RequestHandler } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "../Config/config";
import { StatusCodes } from "http-status-codes";
import { body, oneOf, validationResult } from 'express-validator';

export const login: RequestHandler[] = [
    body( 'id' ).optional().bail().isString(),
    body( 'password' ).exists().withMessage('Your password is missing!').bail().isLength( { min: 8, max: 64 } ).withMessage('Password length should be at least 8 characters long and at most 64!'),
    oneOf( [
        body( 'password' ).exists().withMessage('Your password is missing!').bail().isLength( { min: 8, max: 64 } ).withMessage('Password length should be at least 8 characters long and at most 64!'),
        body( 'username' ).exists().withMessage('Your username is missing!'),
    ] ),
    async ( req: Request, res: Response ) => {
        const errors = validationResult( req );
        if ( !errors.isEmpty() ) {
            res.status( StatusCodes.BAD_REQUEST ).send( { status: StatusCodes.BAD_REQUEST, data: { errors: errors.array() }, message: 'Missing/Invalid data in your request!' } as apiResponse );
            return;
        }

        const getUserQuery = ( req.body.email ? getUserBy( 'email', req.body.email ) : getUserBy( 'username', req.body.username ) );
        console.log( getUserQuery );
        const user = ( await pg.query( getUserQuery ) ).rows[0];
        if ( user && ( ( req.body.email && req.body.email === user.email ) || ( req.body.username && req.body.username === user.username ) ) ) {
            bcrypt.compare( req.body.password, user.password, ( error, match ) => {
                if ( error ) {
                    logError( 'Auth Controller', error.message, error );
                    res.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( { status: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message, data: error } as apiResponse );
                } else if ( match ) {
                    logInfo( 'Auth Controller', 'Successful login attempt.' );
                    delete user.password;
                    user.token = generateToken(user);
                    res.status( StatusCodes.OK ).send( { status: StatusCodes.OK, message: 'Successful login attempt.', data: user } as apiResponse );
                } else {
                    logWarn( 'Auth Controller', 'Unsuccessful login attempt!' );
                    res.status( StatusCodes.UNAUTHORIZED ).send( { status: StatusCodes.UNAUTHORIZED, message: 'Unsuccessful login attempt, please check your credentials.' } as apiResponse );
                }
            } );
        } else {
            logError( 'Auth Controller', `No User found for given: Email=${req.body.email} & Username=${req.body.username}` );
            res.status( StatusCodes.NOT_FOUND ).send( { status: StatusCodes.NOT_FOUND, message: 'User not found!' } as apiResponse );
        }
    }
];


export const signup: RequestHandler[] = [
    body( 'id' ).optional().bail().isString(),
    body( 'email' ).exists().withMessage('Your email is missing!').bail().isEmail().withMessage('You have to set a valid email of yours!'),
    body( 'password' ).exists().withMessage('Your password is missing!').bail().isLength( { min: 8, max: 64 } ).withMessage('Password length should be at least 8 characters long and at most 64!'),
    body( 'username' ).exists().withMessage('Your username is missing!'),
    async ( req: Request, res: Response ) => {
        const errors = validationResult( req );
        if ( !errors.isEmpty() ) {
            res.status( StatusCodes.BAD_REQUEST ).send( { status: StatusCodes.BAD_REQUEST, data: { errors: errors.array() }, message: 'Missing/Invalid data in your request!' } as apiResponse );
            return;
        }

        try {
            const salt = bcrypt.genSaltSync( Number( config.encryptionRounds ) );
            const hash = bcrypt.hashSync( req.body.password, salt );
            const newUser =  { email: req.body.email, password: hash, username: req.body.username } as User;
            const createUserQuery = createUser( newUser );
            const user = ( await pg.query( createUserQuery ) ).rows[0];
            logInfo( `Auth Controller`, `New user signed-up!` );
            res.status( StatusCodes.OK ).send( { status: StatusCodes.OK, message: 'Created new User!', data: user } as apiResponse );
        } catch (error) {
            logError( 'Auth Controller', error.message, error );
            res.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( { status: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message, data: error } as apiResponse );
        }
        
    }
];

export const logout = async ( req:Request, res:Response ) => {
    const token = req.headers.authorization || '';
    if ( token.length > 0 ) {
        const invalidateTokenQuery = invalidateToken( token );
        try {
            await pg.query( invalidateTokenQuery );
            res.status( StatusCodes.OK ).send( { status: StatusCodes.OK, message: 'Logged out successfully!' } as apiResponse );
        } catch ( error ) {
            logError( 'Auth Controller', error.message, error );
            res.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( { status: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message, data: error } as apiResponse );
        }
    }
}

export const getUserBy = ( criteria: string, value: string ) => {
    return `select * from public."user" where "${criteria}"='${value}' limit 1`;
}

export const createUser = ( user: User ) => {
    return generateInsertQuery( `public."user"`, getDefaultUser(), user);
}

export const invalidateToken = ( token: string ) => {
    return `insert into public."blacklistedTokens"(token) values('${ token }');`;
}

export const generateToken = ( user: User  ) => {
    return jwt.sign( { data: user }, config.jwtTokenSecret, { expiresIn: '168h' } );
}