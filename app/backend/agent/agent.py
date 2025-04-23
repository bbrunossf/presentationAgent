# agent.py
from tools import AgentTools
from openai import OpenAI
import os
import json

class AIAgent:
    def __init__(self):
        self.tools = AgentTools()
        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        
    def process_request(self, request):
        """Processa uma solicitação e determina a resposta apropriada"""
        #print (request)
        print (request)
        
        # Primeiro, verifica se o agente pode lidar com o comando diretamente
        direct_commands = {
            "listar projetos": self.handle_project_listing,
            "gráfico de vendas": self.tools.generate_sales_chart,
            "gerar gráfico": self.tools.generate_sales_chart,
            "vendas": self.tools.generate_sales_chart
        }
        
        # Verificar se algum dos comandos diretos está na solicitação
        for cmd, handler in direct_commands.items():
            if cmd.lower() in request.lower():
                return handler()
        
        # Se não for um comando direto, use a API OpenAI para interpretar a solicitação
        return self.interpret_with_openai(request)

    def handle_project_listing(self):
        """Lista todos os projetos do banco de dados"""
        # Consulta ao banco de dados para listar projetos
        projects = self.tools.query_sqlite("SELECT * FROM projects")
        response = {
            "type": "database",
            "content": projects,
            "metadata": {"query": "Listar todos os projetos"}
        }
        # Salva a resposta em JSON
        self.tools.save_agent_response(response)
        return response
        
    def interpret_with_openai(self, user_input):
        """Usa a API OpenAI para interpretar e responder à solicitação"""
        # Definir as ferramentas disponíveis para a API
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "query_database",
                    "description": "Consulta o banco de dados para obter informações",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "sql_query": {
                                "type": "string",
                                "description": "Consulta SQL a ser executada"
                            }
                        },
                        "required": ["sql_query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "generate_sales_chart",
                    "description": "Gera um gráfico de vendas mensais",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            }
        ]
        
        # Primeira chamada para determinar se precisamos de uma ferramenta
        messages = [{"role": "user", "content": user_input}]
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        message = response.choices[0].message
        print(message)
        #ChatCompletionMessage(content='Olá! Como posso ajudar você hoje?', refusal=None, role='assistant', annotations=[], audio=None, function_call=None, tool_calls=None)
        
        # Verificar se o modelo quer usar uma ferramenta
        if message.tool_calls:
            # Executar a ferramenta solicitada
            tool_call = message.tool_calls[0]
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)
            
            tool_result = None
            if function_name == "query_database":
                tool_result = self.tools.query_sqlite(function_args["sql_query"])
            elif function_name == "generate_sales_chart":
                return self.tools.generate_sales_chart()
            
            # Adicionar o resultado da ferramenta à conversa
            messages.append(message)
            messages.append({
                "tool_call_id": tool_call.id,
                "role": "tool",
                "name": function_name,
                "content": json.dumps(tool_result)
            })
            
            # Obter resposta final com o resultado da ferramenta
            final_response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            
            result = {
                "type": "tool_assisted",
                "tool": function_name,
                "content": final_response.choices[0].message.content,
                "raw_data": tool_result
            }
            
            # Salvar em JSON se estiver usando ferramentas
            self.tools.save_agent_response(result)
            
            return result
        else:
            # Se não precisar de ferramenta, retornar resposta direta
            print(f"a resposta não formatada foi {message.content}")
            return {
                "type": "text",
                "content": message.content
            }