export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    console.error("Invalid method for /api/auth/login:", req.method);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    let raw = "";
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    if (!raw) return res.status(400).json({ success: false, message: "Missing JSON body" });

    let body;
    try {
      body = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse JSON body for /api/auth/login", err);
      return res.status(400).json({ success: false, message: "Invalid JSON" });
    }

    const username = body.username;
    const password = body.password;

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "widelle2025";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In a real app you'd return a signed token. Keep simple for demo.
      return res.status(200).json({ success: true });
    }

    console.warn("Failed admin login attempt for user:", username);
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (err) {
    console.error("Unhandled error in /api/auth/login:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
