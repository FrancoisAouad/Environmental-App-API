import express, { Router, Request, Response, NextFunction } from 'express';
import authService from './auth.services';
import verifyJWT from '../lib/jwt/verifyJWT';
import { validate } from 'express-validation';
import {
    registerSchema,
    loginSchema,
    resetPassSchema,
} from './auth.validation';
const AuthService = new authService();

class Controller {
    private router: Router;
    private path: string;

    constructor() {
        this.router = express.Router();
        this.path = '/auth';
        this.initializeRoutes();
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.signup(req.body, req.headers);
            res.status(201).json({
                success: true,
                message: 'User created!',
                data: result,
            });
        } catch (e) {
            next(e);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json({ data: result });
        } catch (e: any) {
            next(e);
        }
    }
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body.refreshToken);
            const result = await AuthService.refreshToken(
                req.body.refreshToken
            );
            res.status(200).json({ data: result });
        } catch (e) {
            next(e);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.logout(req.body);
            res.status(204).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result: any = await AuthService.forgotPassword(req.headers);

            res.status(200).json({
                sucess: true,
                message: `Reset Password email sent to ${result.email}`,
                data: result,
            });
        } catch (e) {
            next(e);
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.resetPassword(
                req.params,
                req.body,
                req.headers.authorization
            );
            res.status(200).json({
                success: true,
                message: 'Password successfully reset!',
                data: result,
            });
        } catch (e) {
            next(e);
        }
    }
    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.verifyEmail(req.headers.authorization);
            res.status(200).json({
                success: true,
            });
        } catch (e) {
            next(e);
        }
    }

    initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            validate({ body: registerSchema }),
            this.signup
        );
        this.router.post(
            `${this.path}/login`,
            validate({ body: loginSchema }),
            this.login
        );
        this.router.post(
            `${this.path}/refreshtoken`,
            verifyJWT.verifyAccessToken,
            this.refreshToken
        );
        this.router.post(
            `${this.path}/forgotpassword`,
            verifyJWT.verifyAccessToken,
            // isEmailVerified,
            this.forgotPassword
        );
        this.router.delete(
            `${this.path}/logout`,
            verifyJWT.verifyAccessToken,
            // isEmailVerified,
            this.logout
        );
        this.router.get(`${this.path}/verifyemail`, this.verifyEmail);
        this.router.patch(
            `${this.path}/resetpassword/:token`,
            validate({ body: resetPassSchema }),
            this.resetPassword
        );
    }
}
export default Controller;
