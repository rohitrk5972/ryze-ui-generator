'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { Send, Sparkles, History, RotateCcw } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onRegenerate: () => void;
  onRollback: (version: number) => void;
  isGenerating: boolean;
  versions: number[];
}

export function ChatPanel({
  messages,
  onSendMessage,
  onRegenerate,
  onRollback,
  isGenerating,
  versions,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isGenerating) {
      onSendMessage(input);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI UI Generator</h2>
            <p className="text-xs text-gray-500">Describe your UI in plain English</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Creating
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Describe the UI you want to create. For example:
              </p>
              <div className="space-y-2 text-left">
                <div className="p-3 bg-white rounded-lg text-sm text-gray-700 border border-gray-200">
                  "Create a login form with email and password"
                </div>
                <div className="p-3 bg-white rounded-lg text-sm text-gray-700 border border-gray-200">
                  "Make a dashboard with sidebar navigation"
                </div>
                <div className="p-3 bg-white rounded-lg text-sm text-gray-700 border border-gray-200">
                  "Add a data table showing user information"
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  } animate-fade-in`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.agentResponse && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs opacity-75 font-medium mb-2">
                        {message.agentResponse.explanation.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <span className="text-sm text-gray-600 ml-2">Generating...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Actions */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Regenerate last response"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
            
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="View version history"
            >
              <History className="w-4 h-4" />
              History ({versions.length})
            </button>
          </div>

          {/* Version selector */}
          {showVersions && versions.length > 0 && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Select version:</p>
              <div className="flex flex-wrap gap-1">
                {versions.map((version, index) => (
                  <button
                    key={version}
                    onClick={() => {
                      onRollback(version);
                      setShowVersions(false);
                    }}
                    className="px-2 py-1 text-xs bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded transition-colors"
                  >
                    v{index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your UI or ask for modifications..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none transition-colors"
            rows={2}
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
