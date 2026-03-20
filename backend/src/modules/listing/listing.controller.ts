import { Request, Response } from "express";
import * as listingService from './listing.service';
import { ListingQuery } from "./listing.schema";
import { TypedRequest } from "../../types/common";
import { isNumeric } from "../../utils/common";
import { logger } from "../../utils/logger";

export const getListings = async (
    req: TypedRequest<ListingQuery>,
    res: Response
): Promise<void> => {
    try {
        const { data = [], total } = await listingService.getListings(req);

        res.status(200).json({
            message: 'Listings fetched successfully',
            metaData: {
                total,
                offset: req.parsedQuery.offset,
                limit: req.parsedQuery.limit,
            },
            data,

        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export const getListingBySlugOrId = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const identifier = req.params.identifier as string;

        const listing = await listingService.getListingBySlugOrId(identifier);

        res.status(200).json({
            message: listing ? 'Listing fetched successfully' : 'Listing not found',
            data: listing,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}