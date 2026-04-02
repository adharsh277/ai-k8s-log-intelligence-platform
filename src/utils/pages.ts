import { escapeHtml } from "./renderHelpers";

interface PageOptions {
  requestId: string;
  serviceName: string;
  headline: string;
  summary: string;
  statusCode: number;
  tone: "success" | "error";
  latencyMs?: number;
  detailsLabel: string;
  detailsValue: string;
}

function buildAppPage(options: PageOptions): string {
  const statusChip = options.tone === "success" ? "Operational" : "Request failed";
  const latencyText = typeof options.latencyMs === "number" ? `${options.latencyMs} ms` : "-";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(options.serviceName)} | ${escapeHtml(options.headline)}</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #050816;
      --panel: rgba(11, 18, 39, 0.78);
      --panel-strong: rgba(10, 16, 35, 0.96);
      --border: rgba(120, 255, 231, 0.18);
      --text: #ecf7ff;
      --muted: #93a8c3;
      --cyan: #55f2d1;
      --blue: #69a7ff;
      --danger: #ff6b8b;
      --shadow: 0 30px 90px rgba(0, 0, 0, 0.5);
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at top left, rgba(85, 242, 209, 0.16), transparent 30%),
        radial-gradient(circle at 80% 20%, rgba(105, 167, 255, 0.16), transparent 28%),
        radial-gradient(circle at bottom, rgba(255, 191, 105, 0.09), transparent 25%),
        var(--bg);
      color: var(--text);
      font-family: Inter, "Segoe UI", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
    }

    body {
      overflow-x: hidden;
    }

    .ambient {
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(circle at center, black, transparent 78%);
      opacity: 0.45;
    }

    .glow {
      position: fixed;
      width: 34rem;
      height: 34rem;
      border-radius: 999px;
      filter: blur(80px);
      opacity: 0.2;
      pointer-events: none;
    }

    .glow.one {
      top: -10rem;
      left: -8rem;
      background: ${options.tone === "success" ? "rgba(85, 242, 209, 0.6)" : "rgba(255, 107, 139, 0.6)"};
    }

    .glow.two {
      right: -10rem;
      bottom: -12rem;
      background: rgba(105, 167, 255, 0.6);
    }

    .frame {
      position: relative;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
    }

    .shell {
      width: min(1120px, 100%);
      display: grid;
      gap: 1.25rem;
      grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr);
      align-items: stretch;
    }

    .hero,
    .panel {
      background: linear-gradient(180deg, rgba(16, 24, 49, 0.92), rgba(7, 11, 24, 0.9));
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
      border-radius: 28px;
      overflow: hidden;
      position: relative;
    }

    .hero {
      padding: 2.25rem;
    }

    .panel {
      padding: 1.4rem;
      display: grid;
      gap: 1rem;
      align-content: start;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.55rem 0.85rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
      color: var(--muted);
      font-size: 0.8rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .eyebrow::before {
      content: "";
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 999px;
      background: ${options.tone === "success" ? "var(--cyan)" : "var(--danger)"};
      box-shadow: 0 0 14px currentColor;
    }

    h1 {
      margin: 1rem 0 0.75rem;
      font-size: clamp(2.75rem, 5vw, 5.5rem);
      line-height: 0.95;
      letter-spacing: -0.06em;
      max-width: 11ch;
    }

    .summary {
      margin: 0;
      max-width: 62ch;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.7;
    }

    .status-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 1.5rem;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.72rem 1rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      font-size: 0.92rem;
    }

    .chip strong {
      color: ${options.tone === "success" ? "var(--cyan)" : "var(--danger)"};
    }

    .stack {
      display: grid;
      gap: 1rem;
      margin-top: 1.7rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .metric {
      padding: 1rem;
      border-radius: 22px;
      background: var(--panel);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .metric span {
      display: block;
      color: var(--muted);
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.45rem;
    }

    .metric strong {
      font-size: 1.08rem;
      letter-spacing: -0.03em;
    }

    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin-top: 1.8rem;
    }

    .button {
      appearance: none;
      border: 0;
      text-decoration: none;
      color: #04131d;
      background: linear-gradient(135deg, var(--cyan), var(--blue));
      padding: 0.9rem 1.2rem;
      border-radius: 14px;
      font-weight: 700;
      letter-spacing: 0.01em;
      box-shadow: 0 14px 28px rgba(85, 242, 209, 0.18);
      transition: transform 160ms ease, box-shadow 160ms ease;
    }

    .button.secondary {
      color: var(--text);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: none;
    }

    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 36px rgba(85, 242, 209, 0.24);
    }

    .panel h2 {
      margin: 0;
      font-size: 1.05rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .signal {
      padding: 1rem;
      border-radius: 20px;
      background: var(--panel-strong);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: grid;
      gap: 0.55rem;
    }

    .signal strong {
      font-size: 1.1rem;
    }

    .signal p {
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
    }

    .detail-list {
      display: grid;
      gap: 0.7rem;
    }

    .detail {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.95rem 1rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--muted);
    }

    .detail b {
      color: var(--text);
      font-weight: 600;
      word-break: break-word;
      text-align: right;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.8rem;
      border-radius: 999px;
      width: fit-content;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: var(--muted);
    }

    .status-badge::before {
      content: "";
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 999px;
      background: ${options.tone === "success" ? "var(--cyan)" : "var(--danger)"};
      box-shadow: 0 0 16px currentColor;
    }

    .footer {
      margin-top: 0.25rem;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    @media (max-width: 900px) {
      .shell {
        grid-template-columns: 1fr;
      }

      .stack {
        grid-template-columns: 1fr;
      }

      h1 {
        max-width: none;
      }
    }

    @media (max-width: 640px) {
      .frame {
        padding: 1rem;
      }

      .hero,
      .panel {
        border-radius: 22px;
      }

      .hero {
        padding: 1.35rem;
      }
    }
  </style>
</head>
<body>
  <div class="ambient"></div>
  <div class="glow one"></div>
  <div class="glow two"></div>

  <main class="frame">
    <section class="shell">
      <article class="hero">
        <div class="eyebrow">${escapeHtml(options.serviceName)} / Kubernetes microservice</div>
        <h1>${escapeHtml(options.headline)}</h1>
        <p class="summary">${escapeHtml(options.summary)}</p>

        <div class="status-row">
          <div class="chip"><strong>${options.statusCode}</strong> HTTP status</div>
          <div class="chip"><strong>${escapeHtml(statusChip)}</strong> response</div>
          <div class="chip"><strong>${escapeHtml(latencyText)}</strong> simulated latency</div>
        </div>

        <div class="stack">
          <div class="metric">
            <span>Service</span>
            <strong>${escapeHtml(options.serviceName)}</strong>
          </div>
          <div class="metric">
            <span>Request ID</span>
            <strong>${escapeHtml(options.requestId)}</strong>
          </div>
          <div class="metric">
            <span>${escapeHtml(options.detailsLabel)}</span>
            <strong>${escapeHtml(options.detailsValue)}</strong>
          </div>
        </div>

        <div class="cta-row">
          <a class="button" href="/">Refresh signal</a>
          <a class="button secondary" href="/health">Health check</a>
        </div>

        <p class="footer">Structured JSON logs are emitted for every request, response, and error with a request ID so this service can plug directly into Kubernetes observability pipelines.</p>
      </article>

      <aside class="panel">
        <h2>Live signal</h2>
        <div class="status-badge">${escapeHtml(statusChip)} · ${options.statusCode}</div>
        <div class="signal">
          <strong>${escapeHtml(options.headline)}</strong>
          <p>${escapeHtml(options.summary)}</p>
        </div>
        <div class="detail-list">
          <div class="detail"><span>Route</span><b>GET /</b></div>
          <div class="detail"><span>Request ID</span><b>${escapeHtml(options.requestId)}</b></div>
          <div class="detail"><span>Diagnostic</span><b>${escapeHtml(options.detailsValue)}</b></div>
        </div>
      </aside>
    </section>
  </main>
</body>
</html>`;
}

export function renderSuccessPage(options: {
  requestId: string;
  serviceName: string;
  latencyMs: number;
}): string {
  return buildAppPage({
    requestId: options.requestId,
    serviceName: options.serviceName,
    headline: "A resilient microservice with a clean operational surface.",
    summary:
      "This request hit the happy path. The service returned HTTP 200, logged the lifecycle in structured JSON, and kept the response shape friendly enough to look like a real product rather than a generic dashboard.",
    statusCode: 200,
    tone: "success",
    latencyMs: options.latencyMs,
    detailsLabel: "Response",
    detailsValue: "Success",
  });
}

export function renderErrorPage(options: {
  requestId: string;
  serviceName: string;
  message: string;
}): string {
  return buildAppPage({
    requestId: options.requestId,
    serviceName: options.serviceName,
    headline: "Transient fault detected in the request path.",
    summary:
      "The service simulated a controlled failure and returned HTTP 500. The error was captured by the centralized handler, logged with the same request ID, and rendered as a focused status page instead of an empty crash screen.",
    statusCode: 500,
    tone: "error",
    detailsLabel: "Error",
    detailsValue: options.message,
  });
}