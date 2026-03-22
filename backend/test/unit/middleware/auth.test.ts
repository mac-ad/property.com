import { NextFunction, Request, Response } from "express";
import { checkAuth } from "../../../src/middlewares/auth.middleware";
import * as agentsService from "../../../src/modules/agents/agents.service";

jest.mock('../../../src/modules/agents/agents.service');

const mockNext: NextFunction = jest.fn();

const createMocReq = (headers: Record<string, string> = {}): Partial<Request> => ({
    headers,
    user: undefined
})

const createMockRes = (): Partial<Response> => ({});

describe('checkAuth middleware', () => {
    afterEach(() => jest.clearAllMocks());

    it('should set is_admin to false when no x-email header', async () => {
        const req = createMocReq() as Request;
        const res = createMockRes() as Response;

        await checkAuth(req, res, mockNext);

        expect(req.user).toEqual({ is_admin: false });
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(agentsService.getAgentByEmail).not.toHaveBeenCalled();
    })

    it('should set is_admin to true when agent has admin role', async () => {
        (agentsService.getAgentByEmail as jest.Mock).mockResolvedValue({
            id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin',
        })

        const req = createMocReq({ 'x-email': 'admin@test.com' }) as Request;
        const res = createMockRes() as Response;

        await checkAuth(req, res, mockNext);

        expect(req.user).toEqual({ is_admin: true });
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(agentsService.getAgentByEmail).toHaveBeenCalledWith('admin@test.com');
    })

    it('should set is_admin to false when agent has user role', async () => {
        (agentsService.getAgentByEmail as jest.Mock).mockResolvedValue({
            id: 2, name: 'User', email: 'user@test.com', role: 'user',
        });

        const req = createMocReq({ 'x-email': 'user@test.com' }) as Request;
        const res = createMockRes() as Response;

        await checkAuth(req, res, mockNext);

        expect(req.user).toEqual({ is_admin: false });
        expect(mockNext).toHaveBeenCalled();
    });

    it('should set is_admin to false when agent is not found', async () => {
        (agentsService.getAgentByEmail as jest.Mock).mockResolvedValue(undefined);

        const req = createMocReq({ 'x-email': 'nobody@test.com' }) as Request;
        const res = createMockRes() as Response;

        await checkAuth(req, res, mockNext);

        expect(req.user).toEqual({ is_admin: false });
        expect(mockNext).toHaveBeenCalled();
    });
})