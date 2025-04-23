// types/AgentResponse.ts
export interface AgentResponse {
    type: 'text' | 'chart' | 'pdf' | 'database' | 'error';
    content: string | Buffer;
    metadata?: {
      title?: string;
      description?: string;
      // Outros metadados relevantes
    };
  }