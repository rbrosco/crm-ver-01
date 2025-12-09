# CRM Dashboard - Sistema de Gestão de Clientes

Um dashboard moderno, responsivo e intuitivo para cadastro e gerenciamento de base de clientes, focado em alta performance e UX refinada.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Tailwind-blue)

## 🚀 Funcionalidades Principais

- **Dashboard Inteligente**: Visualização rápida de contratos vencendo (10/30 dias) e pendências financeiras.
- **Cadastro Completo**: Validação de campos, máscara automática para MAC Address e Autocomplete inteligente de Países.
- **Gestão de Clientes**: 
  - Visualização híbrida (Tabela no Desktop / Cards no Mobile).
  - Integração direta com WhatsApp.
  - Filtros avançados de busca (Nome, Telefone, MAC).
  - Ordenação dinâmica de colunas.
- **Dados**: Importação e Exportação de relatórios em CSV.

## 🛠️ Tecnologias Utilizadas

- **React 19**: Core da aplicação.
- **Tailwind CSS**: Estilização utility-first com tema Dark Mode personalizado (Zinc & Copper).
- **Lucide React**: Ícones vetoriais modernos.
- **ES Modules**: Arquitetura leve sem necessidade de build complexo.

## 📦 Como Rodar o Projeto

Este projeto foi construído para ser leve. Você pode rodá-lo de duas formas:

### Opção 1: Servidor Local (Recomendado)
Devido às políticas de segurança de módulos do navegador (CORS), é ideal usar um servidor simples.
Se você usa VS Code:
1. Instale a extensão "Live Server".
2. Clique com botão direito no `index.html` e escolha "Open with Live Server".

### Opção 2: Node.js (Vite/CRA)
Se preferir migrar para um ambiente Node:
1. Copie os arquivos da pasta `src` (components, types, etc).
2. Instale as dependências (`react`, `react-dom`, `lucide-react`, `tailwindcss`).

## 📱 Layout

O projeto conta com um design responsivo refinado, adaptando-se perfeitamente de monitores ultrawide até dispositivos móveis, mantendo a usabilidade em foco.
