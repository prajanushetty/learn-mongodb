import crypto from 'crypto';
const SECRET = 'Raj Shetty';

export const generateRandomId=(length: number = 16):string =>{
    return crypto.randomBytes(length).toString('hex');
}

export const authentication=(salt:string,password:string)=>{
    return crypto.createHmac('sha512',[password,salt].join('/')).update(SECRET).digest('hex');
}

// export function hashPassword(password: string, salt: string): string {
//     return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
// }

export function generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
}

export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
} 