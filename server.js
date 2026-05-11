import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import FormData from "form-data";

const app = express();
const upload = multer();

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors());

app.get("/", (req, res) => {
  res.send("SAFACARSKZ server is working");
});

app.post("/send", upload.array("photos", 20), async (req, res) => {
  try {
    const text = req.body.text;

    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "BOT_TOKEN or CHAT_ID missing" });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const form = new FormData();

        form.append("chat_id", CHAT_ID);
        form.append("document", file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });

        await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, {
          method: "POST",
          body: form
        });
      }
    }

    res.json({ ok: true, message: "Sent to Telegram" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Telegram send failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SAFACARSKZ server running on port ${PORT}`);
});
