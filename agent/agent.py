# agent.py
from agents import Agent, ModelSettings, function_tool, Runner
from tools import AgentTools
#from openai import OpenAI
import os
import json
import asyncio
import datetime

tools = AgentTools()  # Instância do seu conjunto de ferramentas


class AIAgent:
    def __init__(self):
        self.tools = AgentTools()
        #self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

         # Wrappers das funções para o agente poder usá-las
        @function_tool
        def query_database(sql_query: str) -> str:
            """Consulta o banco de dados SQLite com uma query SQL."""
            result = self.tools.query_database(sql_query)
            return json.dumps(result, default=json_serializer)

        @function_tool
        def generate_sales_chart() -> str:
            """Gera um gráfico de vendas mensais."""
            result = self.tools.generate_sales_chart()
            return json.dumps(result, default=json_serializer)

        # Instancia o agente com modelo, ferramentas e instruções
        self.agent = Agent(
            name="Assistant",
            instructions=(
                "Você é um assistente de análise de dados e relatórios. "
                "Use ferramentas sempre que for útil para responder perguntas ou gerar relatórios."
            ),
            model="gpt-4o",
            tools=[query_database, generate_sales_chart],
        )
        
    async def process_request(self, request):
        """Processa uma solicitação e determina a resposta apropriada"""
        #print (request)
        print (request)
        
        # Primeiro, verifica se o agente pode lidar com o comando diretamente
        direct_commands = {
            "listar projetos": self.handle_project_listing,
            "gráfico de vendas": self.tools.generate_sales_chart,
            "gerar gráfico": self.tools.generate_sales_chart,
            "vendas": self.tools.generate_sales_chart,
            "relatório completo": self.handle_full_report,
        }
        
        # Verificar se algum dos comandos diretos está na solicitação
        for cmd, handler in direct_commands.items():
            if cmd.lower() in request.lower():
                return handler()
        
        # Se não for um comando direto, use a API OpenAI para interpretar a solicitação
        return await self.interpret_with_openai(request)

    def json_serializer(obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        raise TypeError(f"Objeto {obj} do tipo {type(obj)} não é serializável")

    def handle_project_listing(self):
        """Lista todos os projetos do banco de dados"""
        projects = self.tools.query_database('SELECT * FROM "Obra"')
        response = {
            "type": "database",
            "content": projects,
            "metadata": {"query": "Listar todos os projetos"}
        }
        self.tools.save_agent_response(response)
        return response
        
    # def interpret_with_openai(self, user_input: str):
    #     """Interpreta a solicitação com o agente usando o novo SDK."""
    #     response = self.agent.run(user_input)

    #     if isinstance(response, str):
    #         return {
    #             "type": "text",
    #             "content": response
    #         }
    #     elif isinstance(response, dict):
    #         response["type"] = "tool_assisted"
    #         self.tools.save_agent_response(response)
    #         return response

    #versão da função com duas respostas, uma intermediária e outra final
    async def interpret_with_openai(self, user_input: str):
        """
        Retorna uma resposta intermediária imediata e a resposta final após processar a solicitação.
        Ideal para frontend consumir de forma sequencial.
        """
        # Etapa 1: resposta rápida para o usuário
        intermediate = {
            "type": "text",
            "content": "Entendi! Estou analisando isso agora..."
        }

        # Etapa 2: executa o agente normalmente
        #final_raw = self.agent.run(user_input)
        final_raw = await Runner.run(self.agent, input=user_input)

        if isinstance(final_raw, str):
            final = {
                "type": "text",
                "content": final_raw.final_output
            }
        else:
            #final = final_raw.final_output
            #final["type"] = "tool_assisted"
            final = {
                "type": "text",
                "content": final_raw.final_output
            }

        # Opcional: salvar ambas as respostas
        self.tools.save_agent_response(intermediate)
        self.tools.save_agent_response(final)

        return {
            "intermediate": intermediate,
            "final": final
        }
            
    def handle_full_report(self):
        """Gera relatório PDF completo"""
        chart_response = self.tools.generate_sales_chart()
        if chart_response["type"] == "error":
            return chart_response
        
        pdf_response = self.tools.generate_sales_pdf_report(chart_response["content"])
        return pdf_response
