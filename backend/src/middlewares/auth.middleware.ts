import { Request, Response, NextFunction } from 'express';
import { getAgentByEmail } from '../modules/agents/agents.service';


export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {

    const email = req.headers['x-email'] as string;

    if (!email) {
        req.user = {
            is_admin: false,
        }
        return next();
    }

    const agent = await getAgentByEmail(email);

    req.user = {
        is_admin: !agent ? false : agent && agent?.role === 'admin',
    }

    next();
}