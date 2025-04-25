// app/routes/api/run-agent.ts
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { sendTextToAgent } from "~/services/remoteAgent";

export const action: ActionFunction = async ({ request }) => {
  const { prompt } = await request.json();
  console.log("Prompt recebido:", prompt);

  const agentResponse = await sendTextToAgent(prompt);
  
  return json(agentResponse);
};

//create a dummy loader function
export const loader = async () => {
  return json({});
};
