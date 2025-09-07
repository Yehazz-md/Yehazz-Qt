<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    />
    <title>WhatsApp Pair Code (Vercel)</title>
    <style>
      :root { --bg:#0b0d10; --fg:#e8e8e8; --muted:#b8b8b8; --card:#141820; --accent:#25d366; }
      *{ box-sizing:border-box; }
      body{ margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; background: var(--bg); color: var(--fg); }
      .wrap{ max-width: 680px; margin: 8vh auto; padding: 24px; }
      .card{ background: var(--card); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,.35); }
      h1{ margin:0 0 12px; font-size: 24px; letter-spacing:.3px; }
      p{ color: var(--muted); margin: 4px 0 18px; }
      input{ width:100%; padding:14px 16px; border-radius: 12px; border: 1px solid #2a2f3a; background:#0f131a; color:#e8e8e8; outline: none; font-size: 16px; }
      button{ margin-top:12px; width:100%; padding:14px 16px; border-radius: 12px; border:0; background: var(--accent); color:#0b301a; font-weight: 700; font-size: 16px; cursor:pointer; }
      .muted{ font-size: 14px; color: var(--muted); }
      .code{ font-size: 28px; font-weight: 800; letter-spacing: 2px; background: #0f1a13; border: 1px solid #1b3226; color:#bdf1cf; padding: 10px 14px; border-radius: 12px; display:inline-block; }
      .row{ display:flex; gap:12px; align-items:center; justify-content: space-between; flex-wrap: wrap; }
      .hint{ font-size: 13px; color: var(--muted); line-height: 1.5; }
      .link{ color:#9adfb5; text-decoration: none; border-bottom:1px dotted #3a6f52 }
      .footer{ margin-top: 14px; font-size: 12px; color: var(--muted); text-align:center }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>WhatsApp Pair Code</h1>
        <p>Enter your phone number (any format is fine). We’ll return a one-time pairing code.</p>

        <input id="number" placeholder="+94 77 123 4567" />
        <button id="go">Get Pair Code</button>

        <div id="result" style="margin-top:18px; display:none">
          <div class="row">
            <div>
              <div class="muted">Your pairing code</div>
              <div id="code" class="code">----</div>
            </div>
            <div>
              <a id="dl" class="link" href="#">Download session (zip)</a>
            </div>
          </div>
          <div class="hint" style="margin-top:10px">
            On your phone: WhatsApp → <b>Linked devices</b> → <b>Link a device</b> → <b>Link with phone number</b>, then enter the code above.
          </div>
        </div>

        <div id="err" class="muted" style="margin-top:10px;color:#ff9b9b; display:none"></div>
      </div>
      <div class="footer">Note: sessions are saved temporarily on the serverless instance. Download immediately after linking.</div>
    </div>

    <script>
      const number = document.getElementById("number");
      const go = document.getElementById("go");
      const result = document.getElementById("result");
      const code = document.getElementById("code");
      const dl = document.getElementById("dl");
      const err = document.getElementById("err");

      go.onclick = async () => {
        err.style.display = "none";
        result.style.display = "none";
        try {
          const r = await fetch("/pair", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ number: number.value })
          });
          const json = await r.json();
          if (!r.ok) throw new Error(json.error || "Failed");
          code.textContent = json.code || "—";
          dl.href = "/download?sessionId=" + encodeURIComponent(json.sessionId);
          result.style.display = "block";
        } catch (e) {
          err.textContent = e.message || String(e);
          err.style.display = "block";
        }
      };
    </script>
  </body>
</html>
