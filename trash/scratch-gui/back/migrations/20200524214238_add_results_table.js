exports.up = function (knex) {
  return knex.schema.createTable("results", (t) => {
    t.increments().index().primary();

    t.string("name", 15).notNullable().index();

    t.integer("result").notNullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("results");
};
