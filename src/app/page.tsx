"use client";

import { useState } from "react";

export default function Home() {
  const [placa, setPlaca] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function consultarPlaca() {
    if (!placa) {
      setErro("Digite uma placa válida");
      return;
    }

    setLoading(true);
    setErro("");
    setResultado(null);

    try {
      const response = await fetch("/api/consulta-placa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placa }),
      });

      if (!response.ok) {
        throw new Error("Erro na consulta");
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setErro("Não foi possível consultar a placa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Consulta de Placa</h1>

      <input
        type="text"
        placeholder="Digite a placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value.toUpperCase())}
        style={{ padding: 10, width: 200 }}
      />

      <br /><br />

      <button onClick={consultarPlaca} disabled={loading}>
        {loading ? "Consultando..." : "Consultar"}
      </button>

      <br /><br />

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {resultado && (
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 20,
            marginTop: 20,
            borderRadius: 8,
          }}
        >
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </main>
  );
}
