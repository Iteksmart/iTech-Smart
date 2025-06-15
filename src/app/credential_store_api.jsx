// pages/api/credentials/store.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

const secret = process.env.CREDENTIAL_ENCRYPTION_KEY || "default_key_for_demo";
const filePath = path.join(process.cwd(), "data", "credentials.json");

function encrypt(text) {
  const cipher = crypto.createCipher("aes-256-cbc", secret);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { service, credentials } = req.body;
  if (!service || !credentials) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const encrypted = encrypt(JSON.stringify(credentials));
  const record = { service, encrypted, timestamp: new Date().toISOString() };

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];
    existing.push(record);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Credential store error:", err);
    res.status(500).json({ error: "Failed to store credentials" });
  }
}
