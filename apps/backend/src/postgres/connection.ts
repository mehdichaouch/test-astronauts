import pg from "pg";

export function dbConnect(config: pg.ClientConfig): Promise<pg.Client> {
    const pgClient = new pg.Client(config);
    return pgClient.connect().then(() => pgClient);
}