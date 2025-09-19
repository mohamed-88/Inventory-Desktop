const knex = require('knex');
const path = require('path');

let dbPath;

// د حالەتێ Production دا (دەمێ build دبیت)، رێک ژ 'DB_PATH' دهێت
// ئەڤە د electron.js دا هاتیە فرێکرن
if (process.env.DB_PATH) {
  dbPath = process.env.DB_PATH;
} else {
  // د حالەتێ Development دا، رێکا کلاسیک دهێتە بکارئینان
  dbPath = path.join(__dirname, 'inventory_dev.db');
}

// ئەم ڤێ پەیامێ دئێخینە دەرڤە دا د electron.js دا بهێتە گرتن
console.log(`ℹ️  رێکا داتابەیسێ: ${dbPath}`);

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

// بتنێ 'db' بهێتە export کرن.
// فەنکشنێ setupDatabase نوکە دناڤ server.js دایە.
module.exports = db;
