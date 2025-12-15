import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Olá! Sou a assistente digital do mandato. Posso ajudar a esclarecer dúvidas sobre o Edital 2026 ou critérios de avaliação?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "Entendi. Para essa questão específica sobre o edital, recomendo verificar a seção de Parâmetros. Posso ajudar em algo mais?";
      
      if (userMsg.toLowerCase().includes('prazo') || userMsg.toLowerCase().includes('data')) {
        response = "O cronograma oficial define o fim das inscrições para 21/11/2025 e a divulgação dos resultados para 13/02/2026.";
      } else if (userMsg.toLowerCase().includes('saúde') || userMsg.toLowerCase().includes('porcentagem')) {
        response = "Lembre-se: 50% do orçamento total das emendas deve ser obrigatoriamente destinado a ações e serviços públicos de saúde (Art. 166, §9º da CF).";
      } else if (userMsg.toLowerCase().includes('critério') || userMsg.toLowerCase().includes('nota')) {
        response = "Os critérios são: Histórico (20), Consistência (30), Relação com Mandato (10), Impacto Social (20) e Orçamento (20). A nota de corte é 70 pontos.";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 mb-4 overflow-hidden pointer-events-auto flex flex-col transition-all animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="font-bold text-xs">TA</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistente Digital</h3>
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <Sparkles size={10} /> Powered by Gemini
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-200 hover:shadow-blue-500/30 border-2 border-white/10"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
             <Bot size={28} />
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
             </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default Assistant;