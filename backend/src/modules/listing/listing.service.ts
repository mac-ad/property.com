import { pool } from "../../db";
import { TypedRequest } from "../../types/common";
import { isNumeric } from "../../utils/common";
import { ListingQuery } from "./listing.schema";
import { Listing } from "./listing.types";

export const getListings = async (req: TypedRequest<ListingQuery>): Promise<{ data: Listing[], total: number }> => {
    const {
        limit,
        offset,
        sort,
    } = req.parsedQuery;

    const { is_admin } = req.user;

    const { conditions, values } = buildWhere(req.parsedQuery);

    let whereSQL = "";
    if (conditions.length > 0) {
        whereSQL = ` WHERE ${conditions.join(" AND ")}`;
    }

    const defaultSelect = is_admin
        ? "*" :
        "id, title, price, beds, baths, property_type, suburb, created_at, slug, image";

    let q = `SELECT ${defaultSelect} FROM properties ${whereSQL}`;

    if (sort === 'price_asc') {
        q += ` ORDER BY price ASC`;
    } else if (sort === 'price_desc') {
        q += ` ORDER BY price DESC`;
    } else if (sort === 'newest') {
        q += ` ORDER BY created_at DESC`;
    } else if (sort === 'oldest') {
        q += ` ORDER BY created_at ASC`;
    }

    q += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    const dataValues = [...values, limit, offset];

    const result = await pool.query(q, dataValues);

    // counting the total number of rows
    let countQuery = `SELECT COUNT(*) FROM properties ${whereSQL}`;

    const countResult = await pool.query(countQuery, values);
    const total = countResult.rows[0].count;

    return {
        data: result.rows as Listing[],
        total,
    };
}

export const getListingBySlugOrId = async (identifier: string): Promise<Listing> => {

    let q = `SELECT * FROM properties`

    let parsedIdentifier: string | number = identifier;

    if (isNumeric(identifier)) {
        const id = Number(identifier);
        parsedIdentifier = id;
        q += ` WHERE id = $1`;
    } else {
        q += ` WHERE slug = $1`;
    }

    const result = await pool.query(q, [parsedIdentifier]);

    return result.rows[0] as Listing;
}

const buildWhere = (query: ListingQuery) => {
    const {
        search,
        suburb,
        min_price,
        max_price,
        beds,
        baths,
        property_type,
        keyword,
    } = query;


    const conditions: string[] = [];
    const values: any[] = [];

    let i = 1;

    if (search) {
        conditions.push(`title ILIKE $${i++}::text`);
        values.push(`%${search}%`);
    }

    if (suburb) {
        conditions.push(`suburb = $${i++}`);
        values.push(suburb);
    }

    if (min_price) {
        conditions.push(`price >= $${i++}`);
        values.push(min_price);
    }

    if (max_price) {
        conditions.push(`price <= $${i++}`);
        values.push(max_price);
    }

    if (beds) {
        conditions.push(`beds = $${i++}`);
        values.push(beds);
    }

    if (baths) {
        conditions.push(`baths = $${i++}`);
        values.push(baths);
    }

    if (property_type) {
        conditions.push(`property_type = $${i++}`);
        values.push(property_type);
    }

    if (keyword) {
        conditions.push(`title ILIKE $${i++}`);
        values.push(`%${keyword}%`);
    }

    return {
        conditions,
        values,
    };
}

