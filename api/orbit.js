// api/orbit.js —— 服务端代理（隐藏 API Key）
// 部署到 Vercel / Netlify Functions 用。
// 部署后把 index.html 里 ORBIT_CONFIG 改成：
//   { mode:"api", apiEndpoint:"/api/orbit", model:"deepseek-chat" }
// Key 存在服务端环境变量 DEEPSEEK_API_KEY，不写进前端。
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const body = req.body || {};
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (process.env.DEEPSEEK_API_KEY || ""),
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: body.messages || [],
        stream: false,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    const data = await upstream.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "upstream error" });
  }
}
