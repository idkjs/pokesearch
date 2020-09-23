https://gist.github.com/guy-stapleton/baee8845c9378204c1176bdb8699969a

Configuring the setup

1. Setting up the dependices

`yarn init -y`(Initalises a packag.json with the default values)
`yarn add knex sqlite3` (Add knex sqlite module)
`yarn add jest --dev` (Add jest to dev dependices)

2. Adding scripts to the package.json file

```json
"scripts": {
  "knex": "knex",
  "test": "jest"
}
```

3. Optional: Set up file so its an executable file

You can set up a file so that it knows what application should be running it e.g. node, python, ruby

We can set up the file to run as a script by making it an executable. So instead of saying node todo list, we can write ./todo rather than node todo

To make todo have this functionality run `chmod +x todo`

4. Set up the knex configuration file

`yarn run knex init`

5. Edit the knex configuration file so it has informtion about our testing setup

Update the development so it has a useNullAsDefault

```json
  development: {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  },
  useNullAsDefault: true
},
```

Add a test object to the script

```json
test: {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  seeds: {
    directory: './tests/seeds'
  }
}
```

Setting up the database

6. We need a migration information. Migration describes the structure of the tables.

`yarn run knex migrate:make todos`

This will create a migration directory in the project - and add a js file with a very long name (date and time plus the file name). This will contain info about setting up the tables for our database. Remember the maxim: We migrate, before we create the tables

!!!!!!! Don't change the file name of your migration files - These are recorded in your database to figure out what happened when. Doing so may corrupt data !!!!!!!!

With setting up database structure there are two parts the Schema (The structure of the columns) and the content (The records)

You set up two functions: One to apply the table changes (knex referes to these as the latest), the other to remove them (in knex speak a rollback)

When setting up a schema go to migrations and open that js file

The createTableIfNotExists takes two arguments, tablename and a callback function

increment -sets up an incrementing id
string - sets up a text field
integer - adds a number column

http://knexjs.org/#Schema-createTableIfNotExists

```js
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
```

Run `yarn run knex migrate:latest` to set up the schema

7. Add some seed data for testing.

Once you've applied the inital migration

`yarn run knex seed:make test-tasks`

This will create a new directory seeds with the name of the file you pass it. You then edit the table names and the objects so they point to the right table and conatin the right columns and information

`run yarn knex seed:run`

```js
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
```

If you want to use the database with a web interface you then need to hook up knex to your serve and export the app ouut of it

So in your server.js you'ld require the following files in

You'll also want to make the app available to other files

```js
module.exports = function (db) {
  app.set("db", db);
  return app;
};
```
