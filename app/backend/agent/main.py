from fastapi import FastAPI, UploadFile, File
from whisper_handler import transcribe_audio
from openai import OpenAI
import os

app = FastAPI()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    transcript = await transcribe_audio(file)
    #return {"text": transcript}
    print("Transcrição gerada:", transcript)
    return {"text": transcript}

@app.post("/agent")
async def agent(input: dict):
    prompt = input["prompt"]
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    #return {"response": response.choices[0].message.content}
    return {
        "type": "text",
        "prompt": prompt,
        "response": response.choices[0].message.content
        }
