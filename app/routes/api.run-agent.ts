// app/routes/api/run-agent.ts
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { runAgent } from "~/services/remoteAgent";

export const action: ActionFunction = async ({ request }) => {
  const { prompt } = await request.json();

  const result = await runAgent(prompt);

  return json(result);
};
