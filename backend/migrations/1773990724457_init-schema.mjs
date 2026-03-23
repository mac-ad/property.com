/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('agents', {
        id: 'id',
        name: { type: 'text', notNull: true },
        email: { type: 'text', unique: true },
        role: { type: 'text', default: 'user' },
    });

    pgm.createTable('properties', {
        id: 'id',
        title: { type: 'text' },
        price: { type: 'integer' },
        beds: { type: 'integer' },
        baths: { type: 'integer' },
        slug: { type: 'text', unique: true },
        image: { type: 'text' },
        property_type: { type: 'text' },
        suburb: { type: 'text' },
        agent_id: {
            type: 'integer',
            references: '"agents"',
        },
        internal_notes: { type: 'text' },
        created_at: {
            type: 'timestamp',
            default: pgm.func('current_timestamp'),
        },
    });

    // indexes
    pgm.createIndex('properties', ['price']);
    pgm.createIndex('properties', ['suburb']);
    pgm.createIndex('properties', ['property_type']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('properties');
    pgm.dropTable('agents');
};
