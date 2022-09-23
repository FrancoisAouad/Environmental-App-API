import express, { Request, Response, NextFunction, Router } from 'express';
import { validate } from 'express-validation';
import postService from './post.services';
import { postSchema } from './post.validation';
const PostService = new postService();
class Controller {
    private path: string;
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.path = '/post';
        this.initializeRoutes();
    }

    async addPost(req: Request, res: Response, next: NextFunction) {
        try {
            await PostService.addPost(req.body, req.headers);
            res.status(201).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async getPostByID(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PostService.getPostByID(req.params);
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    async getUserPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PostService.getUserPosts(req.headers);
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            await PostService.deletePost(req.params, req.headers);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async editPost(req: Request, res: Response, next: NextFunction) {
        try {
            await PostService.editPost(req.body, req.headers, req.params);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
    async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await PostService.getAllPosts();
            res.status(200).json({ success: true, data: result });
        } catch (e) {
            next(e);
        }
    }
    //error occured during /myposts endpt
    //problem that it was after the /:postid, it should be put after
    initializeRoutes() {
        this.router.get(`${this.path}/`, this.getAllPosts);
        this.router.get(`${this.path}/myposts`, this.getUserPosts);
        this.router.get(`${this.path}/:postId`, this.getPostByID);
        this.router.post(
            `${this.path}`,
            validate({ body: postSchema }),
            this.addPost
        );
        this.router.delete(`${this.path}/:postId`, this.deletePost);
        this.router.put(
            `${this.path}/:postId`,
            validate({ body: postSchema }),
            this.editPost
        );
    }
}
export default Controller;
