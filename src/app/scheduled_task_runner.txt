// scripts/task-runner.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "scheduled-tasks.json");

function readTasks() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function writeTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

function runDueTasks() {
  const now = new Date();
  const tasks = readTasks();

  const updated = tasks.map((task) => {
    if (task.status === "scheduled" && new Date(task.runAt) <= now) {
      console.log(`⏱️ Executing task: ${task.name} for user ${task.userId}`);
      console.log(task.content);
      return { ...task, status: "completed", completedAt: now.toISOString() };
    }
    return task;
  });

  writeTasks(updated);
}

// Run every 30 seconds
console.log("🔁 Task runner started");
setInterval(runDueTasks, 30000);
