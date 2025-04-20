export function generateRoute(routeName: string): string {
  return `
    import { json, LoaderFunction } from 'remix';
    
    export let loader: LoaderFunction = async () => {
      return json({ message: "Este é o conteúdo da rota ${routeName}" });
    };

    export default function ${routeName}() {
      return <div><h1>${routeName}</h1></div>;
    }
  `;
}
