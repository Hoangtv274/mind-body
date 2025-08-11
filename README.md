# Shopify Orders Exporter

A Node.js backend service to export Shopify orders to Excel format.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file in the root directory with:**
   ```
   SHOP_NAME=your-shop-name
   SHOPIFY_API_TOKEN=your-shopify-access-token
   PORT=3000
   ```

3. **Get your Shopify API credentials:**
   - Go to your Shopify admin panel
   - Navigate to Apps > App and sales channel settings
   - Create a private app or use an existing one
   - Copy the API access token
   - Your shop name is the part before `.myshopify.com` in your shop URL

## Running the Server

**Start the server:**
```bash
npm start
```

**Or run directly:**
```bash
node server.js
```

The server will start at `http://localhost:3000`

## Usage

- **Root URL (`/`)**: Welcome page with export button
- **Export Orders (`/export-orders`)**: Downloads Excel file with your Shopify orders

## Features

- Exports orders with: Order ID, Customer Name, Email, Total Price, Created At, Financial Status
- Beautiful web interface
- Excel file download
- Error handling for API failures

## Troubleshooting

- Make sure your `.env` file is properly configured
- Verify your Shopify API token has the necessary permissions
- Check that your shop name is correct (without `.myshopify.com`)
