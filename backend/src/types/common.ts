import { Request } from "express";

export type TypedRequest<TQuery> = Request & {
    parsedQuery: TQuery;
};