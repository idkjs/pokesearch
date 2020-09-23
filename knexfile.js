// Update with your config settings.
const path = require("path");
const db = path.resolve(__dirname, "./db/UserPreferencesDB.sqlite3");
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    seeds: {
      directory: "./tests/seeds",
    },
  },
};
