import tempfile
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

async def transcribe_audio(file):
    """
    Transcreve um arquivo de áudio usando a API da OpenAI.
    
    Args:
        file: O arquivo de áudio enviado pelo cliente.
        
    Returns:
        str: O texto transcrito do áudio.
    """
    try:
        # Criar um arquivo temporário para salvar o conteúdo do áudio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Abrir o arquivo e fazer a transcrição
        print("Agora testando o modelo whisper para transcrição")
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                #model="gpt-4o-transcribe",
                model="whisper-1",  # Usando modelo correto do Whisper
                file=audio_file,
                response_format="text"
            )
            
        # Limpar o arquivo temporário
        os.unlink(tmp_path)
        
        return transcript
    except Exception as e:
        # Garantir que o arquivo temporário seja removido mesmo em caso de erro
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise e