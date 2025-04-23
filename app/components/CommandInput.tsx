// app/components/CommandInput.tsx
import { useState } from "react";
import VoiceInput from "./VoiceInput";
import { useCommandStore } from "~/store/useCommandStore";
import type { AgentResponse } from "~/services/remoteAgent";

export default function CommandInput() {
  const setResponse = useCommandStore((state) => state.setResponse);
  const [command, setCommand] = useState("");

  const handleSubmit = async () => {
    if (!command.trim()) return;
  
    try {
      const res = await fetch("/api/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: command }),
      });
  
      if (!res.ok) {
        const msg = await res.text();
        console.error("Erro na resposta do agente:", msg);
        // store an error response
        setResponse({
          input: command,
          response: { type: "error", content: `Erro: ${msg}` },
        });
        return;
      }

      // full AgentResponse including type, content, metadata, etc.
      const data: AgentResponse = await res.json();
      setResponse({ input: command, response: data });
    } catch (err: any) {
      console.error("Erro na requisição ao agente:", err);
      // store an error response
      setResponse({
        input: command,
        response: { type: "error", content: "Erro ao conectar com o agente." },
      });
    }
  };
  

  return (
    <div className="bg-black p-4 shadow rounded">
      <h2 className="text-lg font-semibold text-red-700 mb-2">Comando do Agente</h2>
      <textarea
        className="w-full p-2 border rounded resize-none bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Digite ou fale seu comando..."
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Executar
        </button>
        <VoiceInput />
      </div>
    </div>
  );
}
