exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("todos")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("todos").insert([
        { id: 1, tasks: "Go get coffee" },
        { id: 2, tasks: "Go to the gym" },
        { id: 3, tasks: "Go to EDA" },
      ]);
    });
};
