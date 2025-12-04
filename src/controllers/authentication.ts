import { createUser, getUSerByEmail } from 'db/users';
import express from 'express';
import { authentication, generateRandomId, generateSessionToken } from '../helpers';

export const register=async (req:express.Request,res:express.Response)=>
{
    try{
        const {email, password, userName} = req.body;
        if(!email || !password || !userName)
        {
            return res.status(400).json({message:'Missing required fields'});
        }
        const existingUserByEmail=await getUSerByEmail(email);
        if(existingUserByEmail)
        {
            return res.status(400).json({message:'Email already in use'});
        }
        const salts = generateRandomId();
        const authentication={
            password,
            salt:salts,
            sessionToken:generateSessionToken()
        };
        const newUser = await createUser({
            email,
            userName,
            authentication,
        });
        return res.status(201).json({user:newUser}).end();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
} 

export const login=async(req:express.Request, res:express.Response)=>
{
    try{
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({message:'Missing required fields'});
        }

        const user = await getUSerByEmail(email);
        if(!user)
        {
            return res.status(400).json({message:'Invalid email or password'});
        }

        if(!user.authentication || !user.authentication.salt || !user.authentication.password) {
            console.error('User missing authentication data', { userId: user._id });
            return res.status(500).json({message:'User authentication data missing'});
        }

        const expectedHash = authentication(user.authentication.salt,password);
        if(user.authentication.password!==expectedHash)
        {
            return res.status(403).json({message:'Invalid email or password'});
        }

        // return res.status(200).json({ message: 'Logged in' });
        
        const salt=generateRandomId();
        user.authentication.sessionToken=authentication(salt,user._id.toString());
        await user.save();

        res.cookie('AUTH',user.authentication.sessionToken,{
            domain:'localhost',
            path:'/',
        });
        return res.status(200).json({user}).end();

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}