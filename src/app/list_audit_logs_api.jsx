// pages/api/audit-log/list.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "audit-log.json");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!fs.existsSync(filePath)) return res.status(200).json([]);
    const logs = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(logs);
  } catch (err) {
    console.error("Audit log read error:", err);
    res.status(500).json({ error: "Failed to read audit log" });
  }
}
