
import { makeApp } from "./http/app.js";
import { dbConnect } from "./postgres/connection.js";
import { PostgresAstronautRepository } from "./postgres/postgresAstronautRepository.js";


if (!process.env["DATABASE_URL"] || !process.env["PORT"]) {
    console.error("ENV variables are missing")
    process.exit(1);
}

const CONNECTION_STRING = process.env["DATABASE_URL"];
const dbClient = await dbConnect({
    connectionString: CONNECTION_STRING,
});

const astronautRepository = new PostgresAstronautRepository(dbClient);
const app = makeApp(astronautRepository);

const PORT = process.env["PORT"] ?? 4000;
const server = app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});