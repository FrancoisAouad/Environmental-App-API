import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import formdata from 'express-form-data';
import corsConfig from './config/corsConfig';
import { sendError, errorHandler } from './utils/handlers/errorHandlers';
import 'colors';
dotenv.config();
class App {
    //ATTRIBUTES
    public app: Application;
    //CONSTRUCTOR
    constructor(controllers: any) {
        this.app = express();
        this.securityMiddleWares();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandlers();
    }
    //SERVER
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(
                `Server running on port ${process.env.PORT}`.blue.italic.bold
            );
        });
    }
    //SECURITY
    securityMiddleWares() {
        this.app.use(helmet());
    }
    //MIDDLEWARE
    initializeMiddlewares() {
        if (process.env.NODE_ENV == 'development') this.app.use(morgan('dev'));
        this.app.use(compression());
        this.app.use(cors(corsConfig));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(formdata.parse());
    }
    //ERROR HANDLERS
    initializeErrorHandlers() {
        this.app.use(sendError);
        this.app.use(errorHandler);
    }
    //CONTROLLERS
    initializeControllers(controllers: any) {
        controllers.forEach((controller: any) => {
            this.app.use('/api/v1', controller.router);
        });
    }
}
export default App;
