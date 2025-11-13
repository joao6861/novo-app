import fetch from "node-fetch";

export default async function handler(req, res) {
  try {

    // 1) LOGIN NO AUTO ÓLEO
    const login = await fetch(process.env.APP_URL + "/api/autooleo-login");
    const loginJson = await login.json();

    if (!loginJson.success) {
      return res.status(500).json({ error: "Falha no login Auto Óleo" });
    }

    const cookie = loginJson.cookie;

    // 2) INICIA A VARREDURA
    const scan = await fetch(process.env.APP_URL + "/api/autooleo-scan", {
      headers: { Cookie: cookie }
    });

    const data = await scan.json();

    // 3) SALVAR NO BANCO DO APLICATIVO
    const save = await fetch(process.env.APP_URL + "/api/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicles: data })
    });

    const result = await save.json();

    return res.status(200).json({
      success: true,
      saved: result,
      message: "Robô executado e dados salvos no banco!"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao rodar o robô", details: err });
  }
}
