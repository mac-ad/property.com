import { pool } from '../src/db';

import agentsData from '../data/seedData/agents.json';
import propertiesData from '../data/seedData/properties.json';
import { slugify } from '../src/utils/common';
import { logger } from '../src/utils/logger';


export const seed = async (endPool: boolean = true) => {

    try {
        // drop all database data to reseed
        await pool.query('DELETE FROM properties');
        await pool.query('DELETE FROM agents');

        // starting a transaction
        logger.info('Starting seeding...');
        await pool.query('BEGIN');

        // seed agents
        logger.info('Seeding agents...');

        const agentsInserted: number[] = [];

        for (const agent of agentsData) {
            const query = `INSERT INTO agents (
                name, email, role
            ) VALUES ($1, $2, $3)
                ON CONFLICT (email) DO NOTHING
                RETURNING id 
            `;

            const results = await pool.query(query, [
                agent.name,
                agent.email,
                agent.role
            ]);

            if (results.rows.length === 0) {
                process.exit(1)
            }

            agentsInserted.push(results.rows[0].id);
        }

        // seed properties
        logger.info('Seeding properties...');
        for (const property of propertiesData) {
            const query = `INSERT INTO properties (
                title, price, beds, baths, property_type, suburb, agent_id, internal_notes, created_at, slug, image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)`;

            // randomly select an agentId from the agentsInserted array
            const agentId = agentsInserted[Math.floor(Math.random() * agentsInserted.length)];

            await pool.query(query, [
                property.title,
                property.price,
                property.beds,
                property.baths,
                property.property_type,
                property.suburb,
                agentId,
                property.internal_notes,
                // to randomize the date so that properties are not all seeded in the same day
                new Date(Date.now() - Math.floor(Math.random() * 2 * 365 * 24 * 60 * 60 * 1000)),
                slugify(property.title),
                property.image,
            ]);
        }

        await pool.query('COMMIT')

        logger.info('Seeding completed');
    } catch (error) {
        logger.error('Seeding failed');
        logger.error(error);
        throw error;
    } finally {
        if (endPool) {
            await pool.end();
        }
    }
}

if (require.main === module) {
    seed();
}