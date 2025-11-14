const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT_TOKEN = "8270335085:AAEuDq3ahSuNM_1vGZTKkcXgs0QdeKYVnHo";

// BOTH OF YOU ARE NOW SUBSCRIBERS
let CHAT_IDS = ["5041856882", "6777316075"]; // You + RingoEmpire

app.get("/", (req, res) => {
  res.send("GETITX BOT IS RUNNING - " + CHAT_IDS.length + " subscribers (You + RingoEmpire)");
});

app.get("/test", async (req, res) => {
  try {
    // Send test to all subscribers
    const sendPromises = CHAT_IDS.map(chatId => 
      axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "🔄 Test message from GetItX bot to all subscribers!"
      })
    );

    await Promise.all(sendPromises);
    res.send("Test message sent to " + CHAT_IDS.length + " subscribers! (You + RingoEmpire)");

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// ORDER ENDPOINT - Sends to both of you
app.post("/order", async (req, res) => {
  console.log("📦 Order received - Sending to", CHAT_IDS.length, "subscribers (You + RingoEmpire)");
  
  try {
    const orderData = req.body;
    
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

    // Send to BOTH of you
    const sendPromises = CHAT_IDS.map(chatId => 
      axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      }).catch(err => {
        console.log(`Failed to send to ${chatId}:`, err.message);
      })
    );

    await Promise.all(sendPromises);
    console.log("✅ Order sent to both subscribers successfully");
    res.json({ success: true, message: "Order received successfully!" });

  } catch (err) {
    console.error("❌ Error processing order:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to process order: " + err.message 
    });
  }
});

function formatOrderItems(items) {
  if (!items || items.length === 0) return "• No items in cart";
  
  return items.map(item => {
    const name = item.name || 'Unknown Product';
    const quantity = item.quantity || 1;
    const price = item.totalUSD || 0;
    return `• ${name} x${quantity} - $${price}`;
  }).join('\n');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 GetItX Bot running with 2 subscribers (You + RingoEmpire)"));
