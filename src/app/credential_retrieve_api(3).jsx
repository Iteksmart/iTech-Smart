// pages/api/credentials/load.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

const secret = process.env.CREDENTIAL_ENCRYPTION_KEY || "default_key_for_demo";
const filePath = path.join(process.cwd(), "data", "credentials.json");

function decrypt(encrypted) {
  const decipher = crypto.createDecipher("aes-256-cbc", secret);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { service, userId } = req.query;
  if (!service || !userId) {
    return res.status(400).json({ error: "Missing service or userId param" });
  }

  try {
    if (!fs.existsSync(filePath)) return res.status(200).json({});

    const stored = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const match = stored.find((entry) => entry.service === service && entry.userId === userId);
    if (!match) return res.status(404).json({});

    const credentials = decrypt(match.encrypted);
    res.status(200).json(credentials);
  } catch (err) {
    console.error("Credential retrieval error:", err);
    res.status(500).json({ error: "Failed to load credentials" });
  }
}
