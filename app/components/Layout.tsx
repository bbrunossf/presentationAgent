// app/components/Layout.tsx
import { useCommandStore } from "~/store/useCommandStore";
import Header from "./Header";
import CommandInput from "./CommandInput";
import OutputDisplay from "./OutputDisplay";
import Canvas from "./Canvas";

export default function Layout() {
    const inputText = useCommandStore((state) => state.inputText);
    const outputText = useCommandStore((state) => state.outputText);

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
          <OutputDisplay text={inputText || "Aguardando entrada..."} />
          <OutputDisplay text={outputText || "Aguardando resposta do agente..."} />
          {/* Canvas for nested AI agent output routes */}
          <Canvas />
        </section>
      </main>
    </div>
  );
}
