#teste para ver se atualiza
from fastapi import FastAPI, UploadFile, File, Request, HTTPException
from whisper_handler import transcribe_audio
from openai import OpenAI
import os
from pydantic import BaseModel  # only used by OpenAIPrompt
from agent import AIAgent

app = FastAPI()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
agent = AIAgent()


class OpenAIPrompt(BaseModel):
    prompt: str
    
# @app.post("/agent/process")
# async def get_agent_response(request: AgentRequest):
##async def get_agent_response(request):
    # """Endpoint para processar comandos diretos usando o agente"""
    # response = agent.process_request(request.command)
    ##response = agent.process_request(request)
    # print(response)
    # return response
    
@app.post("/agent/process")
async def process_command(request: Request):
    # Simplified: parse JSON body manually, no Pydantic
    data = await request.json()
    command = data.get("command")
    if not isinstance(command, str):
        raise HTTPException(status_code=400, detail="Missing or invalid 'command' field")
    # Delegate to agent with the raw command string
    result = await agent.process_request(command)
    #print(f"o resultado do pdf é: {type(result)}")
    return result

    

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    transcript = await transcribe_audio(file)
    #return {"text": transcript}
    print("Transcrição gerada:", transcript)
    return {"text": transcript}

@app.get("/schema")
async def get_schema():
    """Endpoint para retornar diretamente o schema do banco (JSON fixo)."""
    schema = agent.tools.get_database_schema()
    return schema

