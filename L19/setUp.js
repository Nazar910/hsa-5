const { Client } = require('pg');

async function initClients() {
    const clientB = new Client('postgres://testuser:testpassword@localhost:5432/test_db');
    const clientB1 = new Client('postgres://testuser:testpassword@localhost:5433/test_db');
    const clientB2 = new Client('postgres://testuser:testpassword@localhost:5434/test_db');

    await Promise.all([ clientB.connect(), clientB1.connect(), clientB2.connect() ]);

    return { clientB, clientB1, clientB2 };
}

async function createBooksTable(client, categoryId) {
    await client.query(`DROP TABLE IF EXISTS books`);
    await client.query(`
        CREATE TABLE books (
            id bigint not null,
            category_id int not null,
            CONSTRAINT category_id_check CHECK (category_id = ${categoryId}),
            author character varying not null,
            title character varying not null,
            year int not null
        );
    `);
    await client.query(`DROP INDEX IF EXISTS books_category_id_idx`);
    await client.query('CREATE INDEX books_category_id_idx ON books USING btree(category_id)');
}

async function ensureFdwExtension(client) {
    const { rows } = await client.query(`SELECT extname FROM pg_extension WHERE extname = 'postgres_fdw'`);
    if (rows.length) {
        return;
    }

    await client.query('CREATE EXTENSION postgres_fdw');
}

async function main() {
    const { clientB, clientB1, clientB2 } = await initClients();

    await createBooksTable(clientB1, 1);
    await createBooksTable(clientB2, 2);

    await ensureFdwExtension(clientB);
    await clientB.query(`
        CREATE SERVER books_1_server
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS(host 'postgresql-b1', port '5432', dbname 'test_db')
    `);
    await clientB.query(`
        CREATE USER MAPPING FOR testuser
        SERVER books_1_server
        OPTIONS (user 'testuser', password 'testpassword')
    `);
    await clientB.query(`
        CREATE FOREIGN TABLE books_1(
            id bigint not null,
            category_id int not null,
            author character varying not null,
            title character varying not null,
            year int not null
        )
        SERVER books_1_server
        OPTIONS (schema_name 'public', table_name 'books')
    `);

    await clientB.query(`
        CREATE SERVER books_2_server
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS(host 'postgresql-b2', port '5432', dbname 'test_db')
    `);
    await clientB.query(`
        CREATE USER MAPPING FOR testuser
        SERVER books_2_server
        OPTIONS (user 'testuser', password 'testpassword')
    `);
    await clientB.query(`
        CREATE FOREIGN TABLE books_2(
            id bigint not null,
            category_id int not null,
            author character varying not null,
            title character varying not null,
            year int not null
        )
        SERVER books_2_server
        OPTIONS (schema_name 'public', table_name 'books')
    `);

    // set up view
    await clientB.query(`
        CREATE VIEW books AS
            SELECT * FROM books_1
                UNION ALL
            SELECT * FROM books_2
    `)
    // set up rules
    await clientB.query(`CREATE RULE books_insert AS ON INSERT TO books DO INSTEAD NOTHING`)
    await clientB.query(`CREATE RULE books_update AS ON UPDATE TO books DO INSTEAD NOTHING`)
    await clientB.query(`CREATE RULE books_delete AS ON DELETE TO books DO INSTEAD NOTHING`)
    await clientB.query(`
        CREATE RULE books_insert_to_1 AS ON INSERT TO books
            WHERE (category_id = 1)
        DO INSTEAD INSERT INTO books_1 VALUES (NEW.*)
    `)
    await clientB.query(`
        CREATE RULE books_insert_to_2 AS ON INSERT TO books
            WHERE (category_id = 2)
        DO INSTEAD INSERT INTO books_2 VALUES (NEW.*)
    `)

    await Promise.all([
        clientB.end(),
        clientB1.end(),
        clientB2.end(),
    ]);
}

if (require.main === module) {
    main();
}
