import { NextFunction, Request, Response } from "express";
import * as listingService from './listing.service';
import { ListingQuery } from "./listing.schema";
import { TypedRequest } from "../../types/common";
import { logger } from "../../utils/logger";

export const getListings = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { parsedQuery, user } = (req as TypedRequest<ListingQuery>);

        const { data = [], total } = await listingService.getListings(parsedQuery, user?.is_admin ?? false);

        res.status(200).json({
            message: 'Listings fetched successfully',
            metaData: {
                total,
                offset: parsedQuery.offset,
                limit: parsedQuery.limit,
            },
            data,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export const getListingBySlugOrId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const identifier = req.params.identifier as string;
        const { user } = (req as TypedRequest<ListingQuery>);

        const listing = await listingService.getListingBySlugOrId(identifier, user?.is_admin ?? false);

        if (!listing) {
            res.status(404).json({
                message: 'Listing not found',
                data: null,
            });
            return;
        }

        res.status(200).json({
            message: 'Listing fetched successfully',
            data: listing,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export const getSuburbs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const suburbs = await listingService.getSuburbs();

        res.status(200).json({
            message: 'Suburbs fetched successfully',
            data: suburbs,
        });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export const getPropertyTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const propertyTypes = await listingService.getPropertyTypes();
        res.status(200).json({
            message: 'Property types fetched successfully',
            data: propertyTypes,
        });
    }
    catch (error) {
        logger.error(error);
        next(error);
    }
}