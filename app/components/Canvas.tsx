// app/components/Canvas.tsx
import React, { useState, useEffect } from 'react';
import type { AgentResponse, FullAgentResponse } from '~/services/remoteAgent';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configurar worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Componentes de renderização
const TextRenderer: React.FC<{ content: string }> = ({ content }) => (
  <div className="text-content">{content}</div>
);

const ChartRenderer: React.FC<{ content: string | Buffer }> = ({ content }) => {
  // Handle base64 string directly
  if (typeof content === 'string') {
    return (
      <div className="chart-container">
        <img
          src={`data:image/png;base64,${content}`}
          alt="Gráfico gerado"
        />
      </div>
    );
  }
  // Handle binary Buffer or Uint8Array
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (content instanceof Uint8Array || content instanceof Buffer) {
      const blob = new Blob([content], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [content]);
  return (
    <div className="chart-container">
      {imageUrl && <img src={imageUrl} alt="Gráfico gerado" />}
    </div>
  );
};

// const PDFRenderer: React.FC<{ content: Buffer }> = ({ content }) => {
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   useEffect(() => {
//     // Converter buffer para URL de PDF
//     const blob = new Blob([content], { type: 'application/pdf' });
//     const url = URL.createObjectURL(blob);
//     setPdfUrl(url);

//     // Limpar URL criada quando o componente desmontar
//     return () => URL.revokeObjectURL(url);
//   }, [content]);

//   return (
//     <div className="pdf-container">
//       {pdfUrl ? (
//         <iframe 
//           src={pdfUrl} 
//           width="100%" 
//           height="600px" 
//           title="PDF Gerado"
//         />
//       ) : (
//         <p>Carregando PDF...</p>
//       )}
//     </div>
//   );
// };

// const PDFRenderer: React.FC<{ content: string }> = ({ content }) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const pdfUrl = `data:application/pdf;base64,${content}`;

//   return (
//     <div className="pdf-viewer-container">
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//       >
//         <Page 
//           pageNumber={pageNumber} 
//           width={600}
//           renderTextLayer={false}
//           className="pdf-page shadow-lg"
//         />
//       </Document>
      
//       <div className="pdf-controls mt-4">
//         <button
//           onClick={() => setPageNumber(p => Math.max(1, p - 1))}
//           disabled={pageNumber <= 1}
//           className="pdf-button"
//         >
//           Anterior
//         </button>
        
//         <span className="pdf-page-count">
//           Página {pageNumber} de {numPages || '--'}
//         </span>

//         <button
//           onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))}
//           disabled={pageNumber >= (numPages || 1)}
//           className="pdf-button"
//         >
//           Próxima
//         </button>
//       </div>
//     </div>
//   );
// };

const PDFRenderer: React.FC<{ content: string }> = ({ content }) => {
  const pdfUrl = `data:application/pdf;base64,${content}`; // Constrói a URL do PDF

  return (
      <div className="pdf-viewer-container">
          <iframe 
              src={pdfUrl} 
              width="100%" 
              height="600px" 
              title="PDF Gerado"
              style={{ border: 'none' }} 
          />
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

export default function Canvas({ response }: { response: AgentResponse }) {
  // Renders non-text agent responses (chart, pdf, database, error, etc.)
  // For text responses, Layout should use OutputDisplay instead

  console.log("antes de desestruturar:", response);
  //deconstructuring response in 'intermediate' and 'final'
  //const { intermediate, final } = response;

  if (!response) {
    return <div>Carregando resposta do agente...</div>;
  }

  const renderContent = () => {
    //console.log("++++++++++++++resposta recebida:", intermediate);
    //console.log("++++++++++++++resposta recebida:", final);
    //deconstruct 'final' response
    //const { type, content } = final;
    //console.log("++++++++++++++resposta recebida:", type);
    //console.log("++++++++++++++resposta recebida:", content);


    switch (response.type) {
      case 'chart':
        // content expected as base64 or Buffer
        return <ChartRenderer content={response.content as any} />;
      case 'pdf':
        //return <PDFRenderer content={response.content as any} />;
        return <PDFRenderer content={response.content as string} />;
      case 'database':
        return <DatabaseResultRenderer content={response.content as any[]} />;
      case 'error':
        return <ErrorRenderer content={response.content as string} metadata={response.metadata} />;
      default:
        return <div>Tipo de resposta não suportado: {String(response)}</div>;
    }
  };

  return (
    <div className="canvas-container w-full h-full p-4 bg-white shadow-md rounded-lg">      
        {/* {response.metadata?.title && <h2>{response.metadata?.title}</h2>}
        {response.metadata?.description && <p>{response.metadata?.description}</p>} */}
      {renderContent()}
    </div>
  );
}