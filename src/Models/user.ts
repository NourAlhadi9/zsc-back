export interface User {
	id?: string,
	email: string,
    username: string,
	password: string,
	isAdmin: boolean,
	isVerified: boolean,
}

const defaultUser: Required<User> = {
	id: '',
	email: '',
    username: '',
	password: '',
    isAdmin: false,
	isVerified: false,
};


const defaultUserSafe: Required<UserSafe> = {
	id: '',
	email: '',
    username: '',
    isAdmin: false,
	isVerified: false,
};


export type UserSafe = Omit<User, 'password'>;

export const getDefaultUser = () => {
	return objectify( defaultUser );
};

const objectify = <T> ( payload: T ): T => {
	return JSON.parse( JSON.stringify( payload ) );
};
