// app/services/agent.ts
type AgentResponse = {
    type: "text" | "code" | "json" | "error";
    content: string;
  };
  
  export async function runAgent(prompt: string): Promise<AgentResponse> {
    try {
      const response = await fetch("http://localhost:8000/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return { type: "error", content: `Erro do agente: ${errorText}` };
      }
  
      const { response: content } = await response.json();
      return {
        type: "text", // você pode usar um analisador depois para definir tipo
        content,
      };
    } catch (error: any) {
      return {
        type: "error",
        content: `Erro ao executar agente: ${error.message}`,
      };
    }
  }
  