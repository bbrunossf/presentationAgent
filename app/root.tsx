import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  return (
    <html lang="pt-BR" className="bg-gray-900 text-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans">
        <header className="p-4 bg-gray-800 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Agente de IA Interativo 🎤</h1>
        </header>
        <main className="p-4 max-w-4xl mx-auto">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />        
      </body>
    </html>
  );
}