const knex = require('knex');
const path = require('path');

let dbPath;
if (process.env.DB_PATH) {
  dbPath = process.env.DB_PATH;
} else {
  dbPath = path.join(__dirname, 'inventory_dev.db');
}

console.log(`ℹ️  رێکا داتابەیسێ: ${dbPath}`);

const db = knex({
  client: 'sqlite3',
  connection: { filename: dbPath },
  useNullAsDefault: true,
  pool: { afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb) }
});

async function setupDatabase() {
  console.log('Checking database schema...');
  if (!(await db.schema.hasTable('customers'))) {
    await db.schema.createTable('customers', (table) => {
      table.increments('id').primary();
      table.string('bill_number').notNullable().unique();
      table.string('name').notNullable();
      table.string('email').unique();
      table.string('phone');
      table.string('address');
      table.timestamps(true, true);
    });
  }
  // ... (هەمی تەیبلێن دی ل ڤێرە بن)
  console.log('Database setup checked.');
}

// بتنێ db و setupDatabase بهێنە export کرن
module.exports = { db, setupDatabase };
