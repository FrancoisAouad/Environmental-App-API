import express, { Router, Request, Response, NextFunction } from 'express';
import verifyJWT from '../lib/jwt/verifyJWT';
import { validate } from 'express-validation';
import adminService from './admin.services';
import Role from '../middleware/permissions';
import { tagSchema } from './tag.validation';
const AdminService = new adminService();

class Controller {
    private router: Router;
    private path: string;
    private admin: string;

    constructor() {
        this.router = express.Router();
        this.path = '/tag';
        this.admin = '/admin';
        this.initializeRoutes();
    }
    async addTag(req: Request, res: Response, next: NextFunction) {
        try {
            await AdminService.addTag(req.body);
            res.status(201).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async getTagByID(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AdminService.getTagByID(req.params);
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    async deleteTag(req: Request, res: Response, next: NextFunction) {
        try {
            await AdminService.deleteTag(req.params, req.headers);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async editTag(req: Request, res: Response, next: NextFunction) {
        try {
            await AdminService.editTag(req.body, req.headers, req.params);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async getAllTags(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AdminService.getAllTags();
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    async getPostsCreatedByUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await AdminService.getPostsCreatedByUsers();
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    async getPostsByTags(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AdminService.getPostsByTags(req.query);
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }

    initializeRoutes() {
        this.router.get(`${this.path}/:tagId`, this.getTagByID);
        this.router.get(`${this.path}`, this.getAllTags);
        this.router.post(
            `${this.admin}${this.path}`,
            Role.isAdmin,
            validate({ body: tagSchema }),
            this.addTag
        );
        this.router.patch(
            `${this.admin}${this.path}/:tagId`,
            Role.isAdmin,
            validate({ body: tagSchema }),
            this.editTag
        );
        this.router.delete(
            `${this.admin}${this.path}/:tagId`,
            Role.isAdmin,
            this.deleteTag
        );
        this.router.get(
            `${this.admin}/posts/byusers`,
            Role.isAdmin,
            this.getPostsCreatedByUsers
        );
        this.router.get(
            `${this.admin}/posts/bytags`,
            Role.isAdmin,
            this.getPostsByTags
        );
    }
}
export default Controller;
