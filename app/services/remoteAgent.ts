
export type AgentResponse = {
    type: string;
    content: string;
    format?: string;
    metadata?: any;
  };

export type FullAgentResponse = {
    intermediate: AgentResponse;
    final: AgentResponse;
};
  

  
  //export async function sendTextToAgent(text: string): Promise<AgentResponse> {
export async function sendTextToAgent(text: string): Promise<FullAgentResponse> {
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
        
        const agentResponse = await response.json() as FullAgentResponse;        
        return agentResponse;
    } catch (error: any) {
        console.error("Erro ao enviar texto:", error.message);
        throw error; // Lançando o erro para ser tratado por quem chamou a função
    }
}

