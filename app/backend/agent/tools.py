# tools.py
import json
import sqlite3
from typing import Dict, Any, List
import matplotlib.pyplot as plt
import io
import base64
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader


class AgentTools:
    def __init__(self):
        # Configurar a conexão com o banco de dados
        self.db_path = os.environ.get("DB_PATH", "database.sqlite")
        
        # Criar diretório para salvar arquivos de resposta se não existir
        self.output_dir = os.environ.get("OUTPUT_DIR", "outputs")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def save_agent_response(self, response: Dict[str, Any], 
                            filepath: str = None):
        """Salva a resposta do agente em um arquivo JSON."""
        if filepath is None:
            filepath = os.path.join(self.output_dir, 'agent-response.json')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(response, f, ensure_ascii=False, indent=2)
        
        return filepath
    
    def query_sqlite(self, query: str) -> List[Dict]:
        """Executa uma consulta SQL e retorna os resultados como lista de dicionários."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(query)
            results = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return results
        except sqlite3.Error as e:
            return {"error": str(e)}
    
    def generate_sales_chart(self):
        """Gera um gráfico de vendas e retorna uma imagem codificada em base64."""
        try:
            # Buscar dados de vendas do banco de dados
            data = self.query_sqlite("SELECT month, sales FROM sales_data ORDER BY month")
            
            if not data or "error" in data:
                return {"type": "error", "content": "Erro ao buscar dados de vendas"}
            
            # Preparar dados para o gráfico
            months = [item['month'] for item in data]
            sales = [item['sales'] for item in data]
            
            # Criar o gráfico
            plt.figure(figsize=(10, 6))
            plt.bar(months, sales)
            plt.title('Vendas por Mês')
            plt.xlabel('Mês')
            plt.ylabel('Vendas (R$)')
            plt.grid(axis='y', linestyle='--', alpha=0.7)
            
            # Salvar o gráfico em um buffer
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png')
            plt.close()
            buffer.seek(0)
            
            # Converter para base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            # Criar resposta
            response = {
                "type": "chart",
                "content": image_base64,
                "format": "base64_png",
                "metadata": {"title": "Gráfico de Vendas Mensais"}
            }
            
            # Salvar a resposta
            self.save_agent_response(response)
            
            return response
        except Exception as e:
            return {"type": "error", "content": f"Erro ao gerar gráfico: {str(e)}"}
    
    def get_sales_data(self):
        """Retorna os dados de vendas do banco de dados."""
        return self.query_sqlite("SELECT month, sales FROM sales_data ORDER BY month")
        
    def generate_sales_pdf_report(self, chart_base64: str) -> dict:
        """Gera um PDF combinando gráfico e dados tabulares"""
        print("gerando arquivo pdf com o gráfico da consulta")
        try:
            # Criar buffer para o PDF
            pdf_buffer = io.BytesIO()
            
            # Configurar documento PDF
            pdf = canvas.Canvas(pdf_buffer, pagesize=A4)
            width, height = A4

            # Adicionar gráfico
            chart_img = ImageReader(io.BytesIO(base64.b64decode(chart_base64)))
            pdf.drawImage(chart_img, 50, height - 300, width=500, height=250)

            # Adicionar dados tabulares
            pdf.setFont("Helvetica-Bold", 12)
            pdf.drawString(50, height - 320, "Dados de Vendas:")
            
            sales_data = self.get_sales_data() 
            y_position = height - 350
            for row in sales_data:
                pdf.setFont("Helvetica", 10)
                pdf.drawString(50, y_position, 
                    f"Mês: {row['month']} - Vendas: R${row['sales']:.2f}")
                y_position -= 20

            pdf.save()

            # Preparar resposta
            pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
            
            return {
                "type": "pdf",
                "content": pdf_base64,
                "format": "base64_pdf",
                "metadata": {"title": "Relatório de Vendas Completo"}
            }
            
        except Exception as e:
            return {"type": "error", "content": f"Erro ao gerar PDF: {str(e)}"}
            
    