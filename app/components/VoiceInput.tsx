import { useState, useRef } from "react";
import type { AgentResponse } from "~/services/remoteAgent";
import { useCommandStore } from "~/store/useCommandStore";

export default function VoiceInput() {
  const setResponse = useCommandStore((state) => state.setResponse);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setProcessing(true);
      const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.mp3");

      try {
        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const { text } = await transcribeRes.json();
        console.log("Transcrição:", text);
        
        const agentRes = await fetch("/api/run-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });
        if (!agentRes.ok) {
          const msg = await agentRes.text();
          console.error("Erro na resposta do agente:", msg);
          setResponse({
            input: text,
            response: { type: "error", content: `Erro: ${msg}` },
          });
        } else {
          // const data: AgentResponse = await agentRes.json();
          // setResponse({ input: text, response: data }); // Alinhado com CommandInput
          const data = await agentRes.json();
          setResponse({ input: text, response: data.intermediate });
          setTimeout(() => {
            setResponse({ input: text, response: data.final });
          }, 300);
        }
        //onResponse({ input: text, output: "(agent ainda não implementado)" });
      } catch (err) {
        console.error("Erro durante transcrição ou resposta:", err);
      } finally {
        setProcessing(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 text-white font-semibold rounded ${
          recording ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {recording ? "Parar" : "Falar"}
      </button>

      {recording && <MicrophoneVisualizer />}
      {processing && <p className="text-sm text-yellow-500">Processando...</p>}
    </div>
  );
}

// Animação simples de microfone ativo
function MicrophoneVisualizer() {
  return (
    <div className="flex gap-1 items-end h-6 ml-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-white animate-pulse"
          style={{
            height: `${Math.random() * 24 + 8}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
