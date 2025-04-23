// app/routes/api/run-agent.ts
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
// import { runAgent } from "~/services/remoteAgent";
import { sendTextToAgent } from "~/services/remoteAgent";

export const action: ActionFunction = async ({ request }) => {
  const { prompt } = await request.json();
  console.log("Prompt recebido:", prompt);

  //const result = await runAgent(prompt);

  // Send the prompt to the remote agent and get its message
  //const { message } = await sendTextToAgent(prompt);
  const agentResponse = await sendTextToAgent(prompt);
  //console.log("Mensagem recebida do agente:", agentResponse);
  
  // Return field 'content' so the frontend can destructure { content }
  //return json({ content: message });
  return json(agentResponse);
};

//create a dummy loader function
export const loader = async () => {
  return json({});
};
