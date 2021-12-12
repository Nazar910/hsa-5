CREATE TABLE IF NOT EXISTS users(
    id serial,
    name character varying NOT NULL,
    favourite_number int NOT NULL,
    CONSTRAINT "pk_id" PRIMARY KEY(id)
)
