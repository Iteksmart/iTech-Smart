// pages/api/audit-log/add.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "audit-log.json");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, action, target, details } = req.body;

  if (!userId || !action || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const entry = {
    id: Date.now().toString(),
    userId,
    action,
    target,
    details,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    existing.push(entry);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Audit log write error:", err);
    res.status(500).json({ error: "Failed to write audit log" });
  }
}
