// server/config/db.js
const knex = require('knex');
const path = require('path');

const isElectron = !!process.versions['electron'];
let dbPath;

if (isElectron) {
  const { app } = require('electron');
  dbPath = path.join(app.getPath('userData'), 'inventory.db');
} else {
  dbPath = path.join(__dirname, 'inventory_dev.db');
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
});

console.log(`✅ داتابەیس دێ ل ڤێ رێکێ هێتە خەزنکرن: ${dbPath}`);

async function setupDatabase() {
  // 1. Customers
  if (!(await db.schema.hasTable('customers'))) {
    console.log('Creating "customers" table...');
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

  // 2. Invoices (ئەگەر پێتڤی بوو)
  if (!(await db.schema.hasTable('invoices'))) {
    console.log('Creating "invoices" table...');
    await db.schema.createTable('invoices', (table) => {
      table.increments('id').primary();
      table.string('bill_number').notNullable().unique();
      table.decimal('total_amount').notNullable();
      table.decimal('paid_amount').defaultTo(0);
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('customers').onDelete('CASCADE');
      table.timestamps(true, true);
    });
  }

  // 3. Items
  if (!(await db.schema.hasTable('items'))) {
    console.log('Creating "items" table...');
    await db.schema.createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('description');
      table.integer('quantity').notNullable().defaultTo(1);
      table.decimal('price').notNullable();
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('customers').onDelete('CASCADE');
      table.integer('invoice_id').unsigned().nullable().references('id').inTable('invoices').onDelete('SET NULL');
      table.timestamps(true, true);
    });
  }
  
  // 4. Payments
  if (!(await db.schema.hasTable('payments'))) {
    console.log('Creating "payments" table...');
    await db.schema.createTable('payments', (table) => {
      table.increments('id').primary();
      table.decimal('amount').notNullable();
      table.integer('customer_id').unsigned().notNullable().references('id').inTable('customers').onDelete('CASCADE');
      table.timestamps(true, true);
    });
  }
  
  console.log('Database setup checked and completed.');
}

setupDatabase().catch(err => {
  console.error("FATAL: Failed to set up database:", err);
  process.exit(1);
});

module.exports = db;
