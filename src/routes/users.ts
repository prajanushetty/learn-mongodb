import express from 'express';

import {deleteUser, getAllUSers, updateUser} from '../controllers/users';
import {IsAuthenticated, isAdmin} from '../middlewares';

export default(router:express.Router)=>
{
    router.get('/users', IsAuthenticated, getAllUSers);
    router.delete('/users/:id', IsAuthenticated, isAdmin, deleteUser);
    router.put('/users/update/:id', IsAuthenticated, isAdmin, updateUser);
    return router;
};