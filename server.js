import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import FormData from "form-data";

const app = express();
const upload = multer();

const TOKEN = "ТВОЙ_ТОКЕН";
const CHAT_ID = "2054462920";

app.use(cors());

app.post("/send", upload.array("photos"), async (req, res) => {

 const text = req.body.text;

 await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{
  method:"POST",
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
   chat_id:CHAT_ID,
   text:text
  })
 });

 for (let file of req.files) {
  let form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", file.buffer, file.originalname);

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`,{
   method:"POST",
   body:form
  });
 }

 res.json({ok:true});
});

app.listen(3000);