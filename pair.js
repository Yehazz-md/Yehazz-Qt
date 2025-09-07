// api/pair.js
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pino from "pino";
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import PhoneNumber from "awesome-phonenumber";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: on Vercel, only /tmp is writable.
function makeSessionDir(sessionId) {
  const base = "/tmp";
  const dir = path.join(base, `session_${sessionId}`);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

function normalizeNumber(input) {
  // Accepts raw inputs like “+94 77 123 4567”, “0771234567”, etc.
  // Returns e.g. "94771234567"
  const pn = new PhoneNumber(input);
  if (pn.isValid()) {
    const e164 = pn.getNumber("e164"); // +94771234567
    return e164.replace(/\D/g, "");    // 94771234567
  }
  // Fallback: strip non-digits and leading zeros if looks like local format
  const justDigits = String(input).replace(/\D/g, "");
  return justDigits.replace(/^0+/, "");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { number } = await parseBody(req);
    if (!number) {
      return res.status(400).json({ error: "Missing 'number' in JSON body" });
    }

    const phone = normalizeNumber(number);
    if (!phone || phone.length < 6) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sessionDir = makeSessionDir(sessionId);

    const logger = pino({ level: "silent" });
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      auth: state,
      printQRInTerminal: false,
      browser: ["Chrome (Linux)", "Chrome", "121"]
    });

    sock.ev.on("creds.update", saveCreds);

    let pairingCode;
    if (!sock.authState.creds.registered) {
      pairingCode = await sock.requestPairingCode(phone);
      // Persist the pairing code for quick display/debug (optional)
      try {
        writeFileSync(path.join(sessionDir, "PAIRING_CODE.txt"), pairingCode);
      } catch {}
    }

    // Return the code and the sessionId so the client can poll/download later
    return res.status(200).json({
      ok: true,
      sessionId,
      code: pairingCode || null,
      hint:
        "Open WhatsApp → Linked Devices → Link a Device → 'Link with phone number' and enter this code."
    });
  } catch (err) {
    console.error("PAIR ERR:", err);
    return res.status(500).json({ error: String(err && err.message || err) });
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}
