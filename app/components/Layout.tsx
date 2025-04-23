// app/components/Layout.tsx
import { useCommandStore } from "~/store/useCommandStore";
import Header from "./Header";
import CommandInput from "./CommandInput";
import { OutputDisplay } from "./OutputDisplay";
import Canvas from "./Canvas";

export default function Layout() {
    const inputText = useCommandStore((state) => state.inputText);
    const agentResponse = useCommandStore((state) => state.agentResponse);

  return (
    <div className="min-h-screen flex flex-col bg-gray-150">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        <section className="w-full md:w-1/2">
          {/* <CommandInput
            onResponse={({ input, output }) => {
              setTranscription(input);
              setResponse(output);
            }}
          /> */}
          <CommandInput />
        </section>
        <section className="w-full md:w-1/2">
          {/* <OutputDisplay text={transcription || "Aguardando transcrição..."} />
          <OutputDisplay text={response || "Aguardando resposta do agente..."} /> */}
          {/* Display the user's input as text */}
          <OutputDisplay
            response={{
              type: "text",
              content: inputText || "Aguardando entrada...",
            }}
          />
          {/* Display the agent's response: text via OutputDisplay, others via Canvas */}
          {agentResponse ? (
            agentResponse.type === 'text' ? (
              <OutputDisplay response={agentResponse} />
            ) : (
              <Canvas response={agentResponse} />
            )
          ) : (
            <OutputDisplay
              response={{
                type: "text",
                content: "Aguardando resposta do agente...",
              }}
            />
          )}          

        </section>
      </main>
    </div>
  );
}
