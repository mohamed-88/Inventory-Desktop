const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // وەک بەراهیێ، بتنێ db بهێتە وەرگرتن

const app = express();
const PORT = 4000;

// Routes
const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const invoiceRoutes = require('./routes/Invoice');
const paymentRoutes = require('./routes/Payment');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

// پەیاما خەلەتیێ یا گشتی
app.use((err, req, res, next) => {
  console.error('❌ کێشەیەکا نەچاوەڕێکری روودا:', err.stack);
  res.status(500).send('Tiştek xelet çû!');
});

// فەنکشنێ ئامادەکرنا داتابەیسێ ل ڤێرە دهێتە دروستکرن
async function setupDatabase() {
  console.log('Checking database schema...');
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

  // 2. Invoices
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

// یەکەم جار سێرڤەری کار پێ بکە
app.listen(PORT, async () => {
  console.log(`✅ سێرڤەرێ لۆکال کار دکەت لسەر http://localhost:${PORT}` );
  
  // پاشان، پشتراست بە کو داتابەیس ئامادەیە
  try {
    await setupDatabase();
    console.log('✅ داتابەیس ب سەرکەفتی هاتە ئامادەکرن.');
  } catch (err) {
    console.error('❌ خەلەتی د ئامادەکرنا داتابەیسێ دا:', err);
  }
});
