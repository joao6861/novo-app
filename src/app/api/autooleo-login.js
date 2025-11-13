import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://autooleo.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: "contatoaldoscenter@gmail.com",
        password: "12345"
      })
    });

    const cookie = response.headers.get("set-cookie");

    if (!cookie) {
      return res.status(401).json({ success: false, error: "Login falhou" });
    }

    return res.status(200).json({ success: true, cookie });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.toString() });
  }
}
