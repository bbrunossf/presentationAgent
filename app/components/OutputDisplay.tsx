// app/components/OutputDisplay.tsx

// export default function OutputDisplay({ text }: { text: string }) {
//   return (
//     <div className="bg-white p-4 shadow rounded min-h-[150px]">
//       <h2 className="text-lg font-semibold mb-2">Resultado</h2>
//       <pre className="whitespace-pre-wrap text-sm text-gray-700">{text}</pre>
//     </div>
//   );
// }

//import AgentResponse from "~/types/agentResponse";
import { AgentResponse } from "~/services/remoteAgent";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function OutputDisplay({ response }: { response: AgentResponse }) {
  if (response.type === 'chart') {
    console.log("resposta recebida no formato chart");
    // base64 PNG
    return (
      <img
        src={`data:image/png;base64,${response.content}`}
        alt={response.metadata?.title ?? 'Sales chart'}
      />
    );
  }
  // fallback to text  
  //return <pre>{response.content}</pre>;

  // Função para renderizar markdown e código
  const renderContent = (text: string) => {
    const regex = /```(.*?)```/gs; // Regex para capturar blocos de código
    const parts = text.split(regex).map((part, index) => {
      if (index % 2 === 0) {
        // Texto normal
        return <span key={index}>{part}</span>;
      } else {
        // Código
        return (
          <SyntaxHighlighter key={index} language="python" style={darcula}>
            {part}
          </SyntaxHighlighter>
        );
      }
    });

    return parts;
  };

  return (
    <div className="bg-white p-4 shadow rounded min-h-[150px]">
      <h2 className="text-lg font-semibold mb-2">Resultado</h2>
      <div className="whitespace-pre-wrap text-sm text-gray-700">
        {renderContent(response.content)}
      </div>
    </div>
  );
}