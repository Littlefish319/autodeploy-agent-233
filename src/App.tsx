import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Send, 
  Cpu, 
  Globe, 
  CheckCircle, 
  Loader2, 
  Code, 
  Layout, 
  Server,
  Shield,
  Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type Message = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'status';
};

type Step = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
};

export default function App() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'AutoDeploy Agent v1.0 initialized. Ready for instructions.',
      timestamp: new Date(),
      type: 'status'
    }
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: 'Analyze Request', status: 'pending' },
    { id: '2', label: 'Generate Architecture', status: 'pending' },
    { id: '3', label: 'Write Code', status: 'pending' },
    { id: '4', label: 'Deploy to Edge', status: 'pending' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate Agent Process
    await simulateAgentProcess(input);
  };

  const simulateAgentProcess = async (prompt: string) => {
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    // Step 1: Analyze
    updateStep('1', 'active');
    await delay(1000);
    addMessage('agent', `Analyzing request: "${prompt}"...`);
    updateStep('1', 'completed');

    // Step 2: Architecture
    updateStep('2', 'active');
    await delay(1500);
    addMessage('agent', 'Generating system architecture...', 'code');
    updateStep('2', 'completed');

    // Step 3: Code
    updateStep('3', 'active');
    await delay(2000);
    addMessage('agent', 'Writing React components and API routes...', 'text');
    updateStep('3', 'completed');

    // Step 4: Deploy
    updateStep('4', 'active');
    await delay(2000);
    addMessage('system', 'Deploying to production environment...', 'status');
    updateStep('4', 'completed');

    addMessage('agent', 'Deployment successful! Application is live.', 'text');
    setIsProcessing(false);
  };

  const updateStep = (id: string, status: Step['status']) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addMessage = (role: Message['role'], content: string, type: Message['type'] = 'text') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      type
    }]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="flex h-screen w-full bg-deploy-dark text-gray-100 overflow-hidden font-sans selection:bg-deploy-accent selection:text-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-deploy-border bg-deploy-card hidden md:flex flex-col">
        <div className="p-6 border-b border-deploy-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-deploy-accent/10 flex items-center justify-center border border-deploy-accent/20">
              <Cpu className="text-deploy-accent" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AutoDeploy</h1>
              <p className="text-xs text-gray-500 font-mono">AGENT v1.0</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Deployment Status</h3>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center border text-xs transition-colors duration-300",
                  step.status === 'completed' ? "bg-deploy-success/10 border-deploy-success text-deploy-success" :
                  step.status === 'active' ? "bg-deploy-accent/10 border-deploy-accent text-deploy-accent animate-pulse" :
                  "bg-transparent border-gray-700 text-gray-700"
                )}>
                  {step.status === 'completed' ? <CheckCircle size={14} /> : idx + 1}
                </div>
                <span className={cn(
                  "text-sm transition-colors duration-300",
                  step.status === 'active' ? "text-white font-medium" :
                  step.status === 'completed' ? "text-gray-300" :
                  "text-gray-600"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 rounded-lg bg-black/30 border border-deploy-border">
            <div className="flex items-center gap-2 mb-2">
              <Server size={14} className="text-gray-400" />
              <span className="text-xs font-mono text-gray-400">Server Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-deploy-success animate-pulse"></div>
              <span className="text-sm font-mono text-deploy-success">ONLINE</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-deploy-border text-xs text-gray-600 text-center">
          Powered by Google GenAI
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-deploy-border flex items-center justify-between px-6 bg-deploy-dark/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <Cpu className="text-deploy-accent" size={20} />
            <span className="font-bold">AutoDeploy</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 hover:bg-white/5 rounded-md transition-colors">
              <Shield size={18} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-md transition-colors">
              <Layout size={18} className="text-gray-400" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-deploy-accent to-purple-500"></div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-3xl mx-auto",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-white text-black" : 
                msg.role === 'system' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                "bg-deploy-accent/10 text-deploy-accent border border-deploy-accent/20"
              )}>
                {msg.role === 'user' ? <Zap size={16} /> : 
                 msg.role === 'system' ? <Terminal size={16} /> :
                 <Code size={16} />}
              </div>
              
              <div className={cn(
                "flex flex-col gap-1 min-w-0",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    {msg.role}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' ? "bg-white text-black rounded-tr-none" : 
                  msg.role === 'system' ? "bg-orange-500/5 text-orange-200 border border-orange-500/10 font-mono rounded-tl-none" :
                  "bg-deploy-card border border-deploy-border text-gray-200 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="h-8 w-8 rounded-lg bg-deploy-accent/10 text-deploy-accent border border-deploy-accent/20 flex items-center justify-center shrink-0">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="flex items-center h-8">
                <span className="text-sm text-gray-500 animate-pulse">Processing request...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-deploy-border bg-deploy-dark">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe the application you want to deploy..."
              className="w-full bg-deploy-card border border-deploy-border rounded-xl px-4 py-4 pr-12 text-sm focus:outline-none focus:border-deploy-accent focus:ring-1 focus:ring-deploy-accent transition-all placeholder:text-gray-600"
              disabled={isProcessing}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="absolute right-2 top-2 p-2 bg-deploy-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-deploy-accent transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="max-w-3xl mx-auto mt-2 text-center">
            <p className="text-[10px] text-gray-600">
              AutoDeploy Agent can make mistakes. Review generated code before production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
