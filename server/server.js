// server/server.js
const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./config/db');

const app = express();
const PORT = 4000;

// Routes
const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const paymentRoutes = require('./routes/Payment');
const invoiceRoutes = require('./routes/Invoice');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);

// فەنکشنێ سەرەکی
async function startServer() {
  try {
    await setupDatabase();
    console.log('✅ داتابەیس ب سەرکەفتی هاتە ئامادەکرن.');
    app.listen(PORT, () => {
      console.log(`✅ سێرڤەر کار دکەت لسەر http://localhost:${PORT}` );
    });
  } catch (err) {
    console.error('❌ خەلەتی د دەستپێکرنا سێرڤەری دا:', err);
    process.exit(1);
  }
}

// =================================================================
//                    ✅ چارەسەریا کێشەیا 'dev' ✅
// =================================================================
// ئەڤە پشتراست دکەت کو ئەگەر فایل ب 'node server/server.js' کار پێ هاتە کرن،
// سێرڤەر دێ کار کەت.
if (require.main === module) {
  startServer();
}
// =================================================================

// ✅ ڤێ رێزێ بهێلە دا کو د electron.js دا بهێتە بکارئینان
module.exports = startServer;




// const express = require('express');
// const cors = require('cors');
// const { setupDatabase } = require('./config/db'); // بتنێ setupDatabase بهێتە وەرگرتن

// const app = express();
// const PORT = 4000;

// // Routes
// const customerRoutes = require('./routes/Customer');
// const itemRoutes = require('./routes/Item');
// // ... (هەمی رۆتێن دی)

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/customers', customerRoutes);
// app.use('/api/items', itemRoutes);
// // ...

// // فەنکشنێ سەرەکی
// async function startServer() {
//   try {
//     await setupDatabase(); // یەکەم جار داتابەیسێ ئامادە بکە
//     console.log('✅ داتابەیس ب سەرکەفتی هاتە ئامادەکرن.');
    
//     app.listen(PORT, () => {
//       console.log(`✅ سێرڤەر کار دکەت لسەر http://localhost:${PORT}` );
//     });
//   } catch (err) {
//     console.error('❌ خەلەتی د دەستپێکرنا سێرڤەری دا:', err);
//     process.exit(1); // ئەگەر داتابەیس کار نەکەت، سێرڤەری بگرە
//   }
// }

// startServer(); // دەست ب هەمی تشتان بکە
