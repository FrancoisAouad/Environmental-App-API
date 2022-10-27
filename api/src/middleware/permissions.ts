import userModel from '../auth/auth.model';
import { Request, Response, NextFunction } from 'express';
import globalService from '../utils/globalService';
import error from 'http-errors';
const GlobalService = new globalService();

//middleware protection function to check if the user is an admin if we go with implementing the admin route
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = GlobalService.getUser(req.headers.authorization);
        const user = await userModel.findOne({ _id: id });
        //send error if user not found
        if (!user) throw new error.Unauthorized('Invalid email/pass');
        // } else {
        //if user found but is not and admin then deny acccess
        if (user.isAdmin === false) {
            throw new error.Forbidden('Forbidden.');
        } else if (user.isAdmin === true) {
            //if user found and is an admin then give access to the next middleware
            next();
        }
    } catch (e) {
        next(e);
    }
};
export default {
    isAdmin,
};
