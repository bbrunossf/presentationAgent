//import { request } from "node:http";

// app/services/agent.ts
// type AgentResponse = {
//     type: "text" | "code" | "json" | "error";
//     content: string;
//   };

type AgentResponse = {
  message: string; // Alterado para um campo mais simples
};
  
  // export async function runAgent(prompt: string): Promise<AgentResponse> {
  //   console.log("Executando agente com o prompt:", prompt);
  //   try {
  //     const response = await fetch("http://localhost:8000/agent/process", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ content: prompt, type: "text" }),
  //     });

  //     console.log("Response status:", response);
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       return { type: "error", content: `Erro do agente: ${errorText}` };
  //     }
  
  //     const { response: content } = await response.json();
  //     return {
  //       type: "text", // você pode usar um analisador depois para definir tipo
  //       content,
  //     };
  //   } catch (error: any) {
  //     return {
  //       type: "error",
  //       content: `Erro ao executar agente: ${error.message}`,
  //     };
  //   }
  // }
  
  export async function sendTextToAgent(text: string): Promise<AgentResponse> {
    console.log("Enviando texto para o agente:", text);

    try {
        const response = await fetch("http://localhost:8000/agent/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ command: text }), // Enviando 'command'
        });

        console.log("Response status:", response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro do agente: ${errorText}`);
        }

        const result: AgentResponse = await response.json();
        console.log("++++++++++Resposta do agente:", result);
        //return result; // Retornando resposta do agente
        //return result.content; // Retornando apenas o conteúdo
        return { message: result.content }; // Retornando apenas a mensagem (porque ela está vindo como " { type: 'text', content: 'Olá! Como posso ajudá-lo hoje?' }")
    } catch (error: any) {
        console.error("Erro ao enviar texto:", error.message);
        throw error; // Lançando o erro para ser tratado por quem chamou a função
    }
}

