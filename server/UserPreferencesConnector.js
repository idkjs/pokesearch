const knex = require("knex");
const path = require("path");
const dbPath = path.resolve(__dirname, "../dev.sqlite3");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: false,
});

module.exports = db;
