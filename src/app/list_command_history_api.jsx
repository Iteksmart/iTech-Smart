// pages/api/command-history/list.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "command-history.json");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!fs.existsSync(filePath)) return res.status(200).json([]);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.status(200).json(data);
  } catch (err) {
    console.error("Failed to load command history:", err);
    res.status(500).json({ error: "Failed to load command history" });
  }
}
