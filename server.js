require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ExcelJS = require('exceljs');

const app = express();
const PORT = process.env.PORT || 3000;

// Add middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static('public'));

// Root route - welcome page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shopify Orders Exporter</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .btn { 
          display: inline-block; 
          padding: 12px 24px; 
          background: #008060; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 0;
        }
        .btn:hover { background: #006b52; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛍️ Shopify Orders Exporter</h1>
        <p>Welcome to your Shopify backend service!</p>
        <p>Click the button below to export your orders to Excel:</p>
        <a href="/export-orders" class="btn">📊 Export Orders</a>
        <p><small>Make sure you have set up your .env file with SHOP_NAME and SHOPIFY_API_TOKEN</small></p>
      </div>
    </body>
    </html>
  `);
});

app.get('/export-orders', async (req, res) => {
  try {
    const { SHOP_NAME, SHOPIFY_API_TOKEN } = process.env;

    const response = await axios.get(
      `https://${SHOP_NAME}.myshopify.com/admin/api/2024-07/orders.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_API_TOKEN,
          'Content-Type': 'application/json'
        },
        params: {
          status: 'any',
          limit: 50
        }
      }
    );

    const orders = response.data.orders;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.addRow(['Order ID', 'Customer Name', 'Email', 'Total Price', 'Created At', 'Financial Status']);

    orders.forEach(order => {
      worksheet.addRow([
        order.id,
        order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : '',
        order.email || '',
        order.total_price,
        order.created_at,
        order.financial_status
      ]);
    });

    // Send Excel file as download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="shopify_orders.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error fetching orders');
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
