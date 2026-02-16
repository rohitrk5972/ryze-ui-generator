'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
  language?: string;
}

export function CodeEditor({ code, onChange, readOnly = false, language = 'typescript' }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !editorRef.current) return;

    // Load Monaco editor dynamically
    let editor: any;

    const initMonaco = async () => {
      try {
        // Configure Monaco Environment for web workers
        if (typeof window !== 'undefined') {
          (window as any).MonacoEnvironment = {
            getWorker(_: any, label: string) {
              return new Worker(
                new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
                { type: 'module' }
              );
            },
          };
        }

        // Using dynamic import for Monaco
        const monaco = await import('monaco-editor');
        
        // Configure Monaco
        monaco.editor.defineTheme('ryze-theme', {
          base: 'vs',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '6a9955' },
            { token: 'keyword', foreground: '0000ff', fontStyle: 'bold' },
            { token: 'string', foreground: 'a31515' },
          ],
          colors: {
            'editor.background': '#ffffff',
            'editor.lineHighlightBackground': '#f0f9ff',
            'editorLineNumber.foreground': '#94a3b8',
          },
        });

        // Create editor instance
        editor = monaco.editor.create(editorRef.current!, {
          value: code,
          language: language,
          theme: 'ryze-theme',
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        });

        monacoRef.current = editor;

        // Listen for changes
        editor.onDidChangeModelContent(() => {
          const value = editor.getValue();
          onChange(value);
        });
      } catch (error) {
        console.error('Failed to load Monaco editor:', error);
      }
    };

    initMonaco();

    // Cleanup
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [mounted]);

  // Update editor content when code prop changes externally
  useEffect(() => {
    if (monacoRef.current && code !== monacoRef.current.getValue()) {
      monacoRef.current.setValue(code);
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedUI.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Generated Code</h3>
          {!readOnly && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
              Editable
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Download code"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {mounted ? (
          <div ref={editorRef} className="h-full w-full" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading editor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>TypeScript • React</span>
          <span>{code.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}

// Fallback simple code viewer if Monaco fails to load
export function SimpleCodeViewer({ code }: { code: string }) {
  return (
    <div className="h-full overflow-auto bg-gray-900 text-gray-100 p-4">
      <pre className="text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
