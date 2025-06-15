// pages/api/schedule-script.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "scheduled-tasks.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { script, runAt, userId } = req.body;

  if (!script || !runAt || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    const entry = {
      id: Date.now().toString(),
      name: script.name,
      content: script.content,
      runAt,
      userId,
      status: "scheduled"
    };

    existing.push(entry);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    res.status(200).json({ success: true, id: entry.id });
  } catch (err) {
    console.error("Failed to store schedule:", err);
    res.status(500).json({ error: "Server error saving schedule." });
  }
}
