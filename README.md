# Projeto Agente PPT


## Objetivo

O objetivo desse projeto é criar uma interface onde seja possível passar informações para um agente de IA, e exibir os resultados na mesma página, em uma seção exclusiva.
O projeto vai utilizar o framework Remix, e todas as bibliotecas usadas serão registradas nesse arquivo.

## Declaração de Escopo do Projeto
* Interface Intuitiva: Crie uma página com uma interface amigável onde você possa interagir com o agente. Inclua um campo de entrada para comandos ou perguntas.

* Canvas ou Painel de Resultados: Dedique uma seção da página para exibir os resultados das tarefas executadas. Pode ser um canvas para visualizações gráficas ou um painel para texto e gráficos.

* Comunicação com a API: Configure a comunicação entre sua aplicação e a API do agente de IA para enviar comandos e receber resultados.

* Demonstração ao Vivo: Durante a palestra, execute comandos ao vivo e mostre como o agente processa as tarefas, exibindo os resultados no painel em tempo real.


## Etapas de desenvolvimento

* API para Modificação de Rotas: Crie uma API no Remix que permita modificar ou salvar informações relacionadas às rotas. Por exemplo, um endpoint POST que recebe dados para atualizar uma rota específica.

* Detecção de Mudança: Implemente um sistema de detecção de mudanças no lado do servidor, que atualize a interface do usuário quando uma rota for modificada.

* Re-renderização Automática: Utilize a funcionalidade de revalidação ou re-renderização automática do Remix para refletir as mudanças na interface do usuário assim que a rota for atualizada.

* Feedback Visual: Garanta que o painel ou canvas na página mostre claramente as mudanças em tempo real, proporcionando um feedback visual instantâneo.

## Estrutura inicial do Projeto
Relação de pastas e arquivos necessários
/app  
├── /routes  
│   ├── index.tsx            # Rota principal que renderiza a interface geral  
│   ├── /generated           # Pasta para armazenar as rotas geradas dinamicamente  
│   │   └── newRoute.tsx     # Exemplo de uma rota gerada dinamicamente  
├── /components  
│   ├── Layout.tsx           # Layout principal da aplicação  
│   ├── Sidebar.tsx          # Componente para a navegação lateral  
│   ├── WorkloadChart.tsx    # Componente para renderizar o gráfico de carga de trabalho  
├── /utils  
│   ├── generateRoute.ts     # Função para gerar código de novas rotas  
│   └── writeRouteToFile.ts  # Função para escrever o código gerado no arquivo da rota  
├── /services  
│   └── agent.ts             # Agente de IA que gera o código das rotas  
├── /styles  
│   └── global.css           # Estilos globais  
├── /data  
│   └── routes.json          # Arquivo JSON que mantém o histórico das rotas geradas  
└── /config  
    └── remix.config.js      # Arquivo de configuração do Remix  

