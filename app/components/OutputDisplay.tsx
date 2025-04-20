// app/components/OutputDisplay.tsx
export default function OutputDisplay({ text }: { text: string }) {
  return (
    <div className="bg-white p-4 shadow rounded min-h-[150px]">
      <h2 className="text-lg font-semibold mb-2">Resultado</h2>
      <pre className="whitespace-pre-wrap text-sm text-gray-700">{text}</pre>
    </div>
  );
}
