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

app.post("/order", async (req, res) => {
  let body = req.body;

  let message = `
New Order Received:
Name: ${body.name}
App ID: ${body.appId}
Amount: ${body.amount}
Coin Type: ${body.coin}
Phone: ${body.phone}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });

    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
