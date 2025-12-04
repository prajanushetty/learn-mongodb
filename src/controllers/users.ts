import express from 'express';
import {getUsers, deleteUserById, updateUserById, getUserById} from 'db/users';

export const getAllUSers=async(req:express.Request,res:express.Response)=>
{
    try{
        const users=await getUsers();
        return res.status(200).json({users}).end();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const deleteUser=async(req:express.Request,res:express.Response)=>
{
    try{
       const userId=req.params.id;
       await deleteUserById(userId);
       return res.status(200).json({message:`User with id ${userId} deleted`}).end();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const updateUser=async(req:express.Request,res:express.Response)=>
{
    try{
        const userId=req.params.id;
        const user = await getUserById(userId);

        if(!user)
        {
            return res.status(404).json({message:'User not found'});
        }
        const updatedUser=await updateUserById(userId,req.body);
        return res.status(200).json({user:updatedUser}).end();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
}
export default {getAllUSers,deleteUser, updateUser};