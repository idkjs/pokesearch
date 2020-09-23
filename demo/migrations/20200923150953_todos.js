exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists("todos", function (table) {
    table.increments();
    table.string("tasks");
    table.integer("urgent");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("coffee");
};
