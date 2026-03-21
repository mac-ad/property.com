import Router from 'express';
import { checkAuth } from '../../middlewares/auth.middleware';
import { validateQuery } from '../../middlewares/validate';
import * as listingValidation from './listing.schema';
import * as listingController from './listing.controller';

const router = Router();

router.get("/suburbs", listingController.getSuburbs)
router.get("/property-types", listingController.getPropertyTypes)

router.get(
    "/",
    checkAuth,
    validateQuery(listingValidation.listingQuerySchema),
    listingController.getListings
)

// get listing by slug or id
router.get(
    "/:identifier",
    checkAuth,
    listingController.getListingBySlugOrId
)



export const listingRouter = router;