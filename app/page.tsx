'use client';

import React, { useState, useCallback } from 'react';
import { ChatPanel } from '@/components/ui/ChatPanel';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { LivePreview } from '@/components/ui/LivePreview';
import { ChatMessage, AgentResponse } from '@/lib/types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<AgentResponse[]>([]);

  const generateUI = useCallback(async (userMessage: string, isModification: boolean = false) => {
    setIsGenerating(true);
    setError(null);

    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Call API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIntent: userMessage,
          conversationHistory: [...messages, newUserMessage],
          previousCode: isModification ? currentCode : undefined,
          isModification,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      const agentResponse: AgentResponse = data.data;

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: agentResponse.explanation.summary,
        agentResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentCode(agentResponse.code.code);
      setVersions((prev) => [...prev, agentResponse]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Add error message
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `❌ Error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, currentCode]);

  const handleSendMessage = useCallback((message: string) => {
    const isModification = messages.length > 0 && currentCode.length > 0;
    generateUI(message, isModification);
  }, [messages, currentCode, generateUI]);

  const handleRegenerate = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        generateUI(lastUserMessage.content, false);
      }
    }
  }, [messages, generateUI]);

  const handleRollback = useCallback((version: number) => {
    const versionIndex = versions.findIndex(v => v.version === version);
    if (versionIndex !== -1) {
      const targetVersion = versions[versionIndex];
      setCurrentCode(targetVersion.code.code);
      
      // Add system message about rollback
      const rollbackMessage: ChatMessage = {
        role: 'assistant',
        content: `↩️ Rolled back to version ${versionIndex + 1}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, rollbackMessage]);
    }
  }, [versions]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCurrentCode(newCode);
  }, []);

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ryze UI Generator</h1>
              <p className="text-sm text-gray-600">AI-powered deterministic UI creation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Status:</span>{' '}
              {isGenerating ? (
                <span className="text-primary-600 flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="text-green-600">● Ready</span>
              )}
            </div>
            
            {versions.length > 0 && (
              <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                {versions.length} version{versions.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content - 3 panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-96 flex-shrink-0">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
            onRollback={handleRollback}
            isGenerating={isGenerating}
            versions={versions.map(v => v.version)}
          />
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 min-w-0">
          <CodeEditor
            code={currentCode}
            onChange={handleCodeChange}
            readOnly={false}
          />
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 min-w-0">
          <LivePreview
            code={currentCode}
            error={error}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Built for Ryze AI</span>
            <span>•</span>
            <span>Deterministic Component System</span>
            <span>•</span>
            <span>3-Step AI Agent</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <span>Made with ❤️</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
