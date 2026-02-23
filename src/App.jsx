import { useState } from "react";

export default function App() {
  const [health, setHealth] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkHealth() {
    setLoading(true);
    setHealth("");
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      setHealth(JSON.stringify(json, null, 2));
    } catch (e) {
      setHealth(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function renderTemplate() {
    setLoading(true);
    setOutput("");
    try {
      // Adjust payload to match your /templates/render contract if needed
      const payload = {
        templateId: "uc3",
        data: {
          ChaseByDate: "2026-02-26",
        },
      };

      const res = await fetch("/api/templates/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      setOutput(text);
    } catch (e) {
      setOutput(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 900 }}>
      <h1>DisputeMate</h1>
      <p>API is proxied via Cloudflare Worker at <code>/api/*</code>.</p>

      <div style={{ display: "flex", gap: 12 }}>
        <button disabled={loading} onClick={checkHealth}>
          Check /api/health
        </button>
        <button disabled={loading} onClick={renderTemplate}>
          POST /api/templates/render
        </button>
      </div>

      <h3>Health</h3>
      <pre>{health}</pre>

      <h3>Render Output</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}
