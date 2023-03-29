import IUser from '../entity/Users';

declare global {
    namespace Express {
        export interface Users extends IUser {}
    }
}