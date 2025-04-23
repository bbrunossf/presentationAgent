// app/routes/canvas.tsx
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { AgentResponse } from '~/types/AgentResponse';

// Componentes de renderização
const TextRenderer: React.FC<{ content: string }> = ({ content }) => (
  <div className="text-content">{content}</div>
);

const ChartRenderer: React.FC<{ content: string | Buffer }> = ({ content }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Converter buffer para URL de imagem
    if (content instanceof Buffer || content instanceof Uint8Array) {
      const blob = new Blob([content], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      // Limpar URL criada quando o componente desmontar
      return () => URL.revokeObjectURL(url);
    }
  }, [content]);

  return (
    <div className="chart-container">
      {imageUrl && <img src={imageUrl} alt="Gráfico gerado" />}
    </div>
  );
};

const PDFRenderer: React.FC<{ content: Buffer }> = ({ content }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Converter buffer para URL de PDF
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    // Limpar URL criada quando o componente desmontar
    return () => URL.revokeObjectURL(url);
  }, [content]);

  return (
    <div className="pdf-container">
      {pdfUrl ? (
        <iframe 
          src={pdfUrl} 
          width="100%" 
          height="600px" 
          title="PDF Gerado"
        />
      ) : (
        <p>Carregando PDF...</p>
      )}
    </div>
  );
};

const DatabaseResultRenderer: React.FC<{ content: any[] }> = ({ content }) => {
  // Renderização flexível para resultados de banco de dados
  return (
    <div className="database-results">
      <table>
        <thead>
          <tr>
            {content.length > 0 && 
              Object.keys(content[0]).map((key) => (
                <th key={key}>{key}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {content.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ErrorRenderer: React.FC<{ content: string, metadata?: any }> = ({ 
  content, 
  metadata 
}) => (
  <div className="error-container">
    <h3>Erro na Operação</h3>
    <p>{content}</p>
    {metadata && (
      <details>
        <summary>Detalhes do Erro</summary>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </details>
    )}
  </div>
);

// // Definir o tipo de retorno do loader
// type LoaderData = {
//   response: AgentResponse;
// };

export const loader: LoaderFunction = async () => {
  try {
    // Ler arquivo JSON gerado pelo agente
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.resolve('./agent-response.json');
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const agentResponse: AgentResponse = JSON.parse(rawContent);

    return { response: agentResponse };
  } catch (error) {
    return { 
      response: {
        type: 'error',
        content: 'Erro ao carregar resposta do agente',
        metadata: { 
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined
        }
      }      
    };
  }
};

export default function Canvas() {
  //const { response } = useLoaderData<LoaderData>();
  const response  = useLoaderData<typeof loader>();
  console.log('Response:', response);
  //const response  = null;

  if (!response) {
    return <div>Carregando...</div>;
  }

  const renderContent = () => {
    switch (response.type) {
      case 'text':
        return <TextRenderer content={response.content as string} />;
      
      case 'chart':
        return <ChartRenderer content={response.content} />;
      
      case 'pdf':
        return <PDFRenderer content={response.content as Buffer} />;
      
      case 'database':
        return <DatabaseResultRenderer content={response.content as any[]} />;
      
      case 'error':
        return <ErrorRenderer 
          content={response.content as string} 
          metadata={response.metadata}
        />;
      
      default:
        return <div>Tipo de resposta não suportado</div>;
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        {response.metadata?.title && (
          <h2>{response.metadata.title}</h2>
        )}
        {response.metadata?.description && (
          <p>{response.metadata.description}</p>
        )}
      </div>
      {renderContent()}
    </div>
  );
}