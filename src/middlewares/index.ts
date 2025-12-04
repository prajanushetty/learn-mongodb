import express from 'express';
import {get, merge} from 'lodash';
import {getUSerBySessionToken} from 'db/users';

export const IsAuthenticated = async(req:express.Request,res:express.Response,next:express.NextFunction)=>
{
    try{
        const sessionToken= get(req,'AUTH');
        if(!sessionToken)
        {
            return res.status(401).json({message:'Unauthorized'});
        }

        const existingUser = await getUSerBySessionToken(sessionToken);
        if(!existingUser)
        {
            return res.status(403).json({message:'Unauthorized'});
        }
        merge(req,{user:existingUser});
        // Attach user to request object
        return next();
    } 
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const isAdmin = async(req:express.Request,res:express.Response,next:express.NextFunction)=>
{
    try{
        const {id}=req.params;
        const currentUserId= get(req,'user') as unknown as string;
        if(!currentUserId)
        {
            return res.status(403).json({message:'Forbidden'});
        }
        if(currentUserId.toString()!==id)
        {
            return res.status(403).json({message:'Forbidden'});
        }
        return next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
}
export default {IsAuthenticated,isAdmin};