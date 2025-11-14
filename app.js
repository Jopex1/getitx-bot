const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT_TOKEN = "8270335085:AAEuDq3ahSuNM_1vGZTKkcXgs0QdeKYVnHo";
const CHAT_ID = "5041856882";

app.get("/", (req, res) => {
  res.send("BOT IS RUNNING");
});

app.get("/test", async (req, res) => {
  try {
    await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: "Test message from Render bot."
      }
    });

    res.send("Sent!");
  } catch (err) {
    res.send("Error sending message: " + err.message);
  }
});

// FIXED ORDER ENDPOINT - Matches your frontend data structure
app.post("/order", async (req, res) => {
  console.log("📦 Order received:", JSON.stringify(req.body, null, 2));
  
  try {
    const orderData = req.body;
    
    // Format order message for Telegram
    let message = `
🛒 *NEW ORDER - GETITX*  
━━━━━━━━━━━━━━━━━━━━

👤 *Customer Information*
• Name: ${orderData.customer?.first_name || 'N/A'} ${orderData.customer?.last_name || 'N/A'}
• App ID: ${orderData.customer?.app_id || 'N/A'}
• Email: ${orderData.customer?.email || 'N/A'}
• Phone: ${orderData.customer?.phone || 'N/A'}

📍 *Shipping Address*
• Address: ${orderData.shipping?.address || 'N/A'}
• City: ${orderData.shipping?.city || 'N/A'} 
• State: ${orderData.shipping?.state || 'N/A'}
• Country: ${orderData.shipping?.country || 'N/A'}
• Postcode: ${orderData.shipping?.postcode || 'N/A'}

🛒 *Order Details*
${formatOrderItems(orderData.order?.items || [])}
• Total: ${orderData.order?.currency || 'USD'} ${orderData.order?.total || '0.00'}
• Notes: ${orderData.order?.notes || 'No notes'}

⏰ *Order Time*: ${orderData.order?.timestamp || new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━
    `;

    // Send to Telegram
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    console.log("✅ Order sent to Telegram successfully");
    res.json({ success: true, message: "Order received successfully!" });

  } catch (err) {
    console.error("❌ Error processing order:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to process order: " + err.message 
    });
  }
});

// Helper function to format order items
function formatOrderItems(items) {
  if (!items || items.length === 0) return "• No items in cart";
  
  return items.map(item => {
    const name = item.name || 'Unknown Product';
    const quantity = item.quantity || 1;
    const price = item.totalUSD || 0;
    return `• ${name} x${quantity} - $${price}`;
  }).join('\n');
}

// FIXED PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
