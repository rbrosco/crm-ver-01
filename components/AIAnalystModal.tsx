import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Client } from '../types';

interface AIAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `Você é a IA analista de dados e assistente de gerenciamento do sistema CRMPro. Sua função primária é auxiliar o administrador do sistema a tomar decisões informadas sobre a base de clientes.

### 🎯 Tarefas e Personalidade

1.  **Identidade:** Você deve sempre se apresentar como "Assistente Analítico CRMPro". Sua comunicação deve ser profissional, concisa e focada em métricas e ações.
2.  **Análise de Dados:** Interprete dados de entrada (como listas de clientes, informações de vencimento, planos) e forneça insights acionáveis.
    * **Exemplo:** Se a taxa de vencimentos em 10 dias estiver alta, sugira ações de contato.
3.  **Geração de Resumo:** Crie resumos diários ou semanais do estado do CRM, destacando:
    * Novos Clientes Cadastrados.
    * Clientes com Vencimento Próximo (10 e 30 dias).
    * Clientes Pendentes/Não Pagos.
4.  **Sugestão de Ações:** Para qualquer problema detectado (ex: cliente inativo, alto índice de inadimplência em um País específico), forneça no mínimo 3 sugestões de ação.

### 📝 Formato de Saída (Regras Estritas)

* Sempre utilize Markdown para formatar a resposta com clareza.
* Use títulos (##) para separar as seções de análise.
* Para listas de sugestões ou insights, utilize bullet points (*).
* **Métricas Financeiras:** Sempre que possível, use **negrito** para destacar números e porcentagens críticas (vencimentos, taxas, etc.).`;

export const AIAnalystModal: React.FC<AIAnalystModalProps> = ({ isOpen, onClose, clients }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: "Olá! Sou o Assistente Analítico CRMPro. Como posso ajudar a analisar sua base de clientes hoje?"
      }]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // We send the clients data as context with the user's prompt
      const dataContext = `
        DADOS ATUAIS DO SISTEMA (Formato JSON):
        ${JSON.stringify(clients)}
        
        DATA DE HOJE: ${new Date().toLocaleDateString('pt-BR')}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { text: dataContext },
                    { text: userMessage }
                ]
            }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const text = response.text || "Desculpe, não consegui processar a análise no momento.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Erro na IA:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Ocorreu um erro ao conectar com o serviço de IA. Verifique sua chave API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-2xl h-[80vh] rounded-2xl border border-zinc-700 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Analista CRMPro</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <Sparkles size={10} className="text-indigo-400" />
                Powered by Gemini 2.5
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950/50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tr-none' 
                    : 'bg-indigo-600/10 text-indigo-100 border border-indigo-500/20 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
                <span className="text-xs text-zinc-400">Analisando dados...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre vencimentos, receitas ou peça um resumo..."
              className="flex-1 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-zinc-600"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-2">
            A IA analisa apenas os dados visíveis atualmente no painel.
          </p>
        </div>

      </div>
    </div>
  );
};
