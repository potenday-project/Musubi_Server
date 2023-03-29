import { User } from '../entity/Users';

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}