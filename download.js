// api/download.js
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { sessionId } = Object.fromEntries(new URL(req.url, "http://x").searchParams);
    if (!sessionId) {
      return res.status(400).json({ error: "Missing 'sessionId' query param" });
    }

    const sessionDir = path.join("/tmp", `session_${sessionId}`);
    if (!fs.existsSync(sessionDir)) {
      return res.status(404).json({ error: "Session not found (or expired)" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="session_${sessionId}.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      console.error(err);
      res.status(500).end();
    });

    archive.directory(sessionDir, false);
    archive.pipe(res);
    await archive.finalize();
  } catch (err) {
    console.error("DOWNLOAD ERR:", err);
    res.status(500).json({ error: String(err && err.message || err) });
  }
}
