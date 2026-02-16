'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw, Maximize2, Smartphone, Monitor, Tablet } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  error?: string | null;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function LivePreview({ code, error }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const viewportSizes = {
    desktop: { width: '100%', height: '100%', icon: Monitor },
    tablet: { width: '768px', height: '1024px', icon: Tablet },
    mobile: { width: '375px', height: '667px', icon: Smartphone },
  };

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Build the complete HTML document
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      width: 100%;
      min-height: 100vh;
    }
    .error-boundary {
      padding: 2rem;
      background: #fef2f2;
      border: 2px solid #fecaca;
      border-radius: 0.5rem;
      color: #991b1b;
      margin: 1rem;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    
    // Import component library (mock)
    const componentLibrary = {
      Button: ({ children, variant = 'primary', size = 'md', onClick, disabled = false, fullWidth = false, type = 'button' }) => {
        const variantClasses = {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
          outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          ghost: 'text-gray-700 hover:bg-gray-100',
          danger: 'bg-red-600 hover:bg-red-700 text-white',
        };
        
        const sizeClasses = {
          sm: 'px-3 py-1.5 text-sm',
          md: 'px-4 py-2 text-base',
          lg: 'px-6 py-3 text-lg',
        };
        
        return (
          <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={\`font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed \${variantClasses[variant]} \${sizeClasses[size]} \${fullWidth ? 'w-full' : ''}\`}
          >
            {children}
          </button>
        );
      },
      
      Card: ({ children, title, subtitle, footer, variant = 'default', padding = 'md', hoverable = false }) => {
        const variantClasses = {
          default: 'bg-white',
          bordered: 'bg-white border-2 border-gray-200',
          elevated: 'bg-white shadow-lg hover:shadow-xl',
        };
        
        const paddingClasses = {
          none: '',
          sm: 'p-3',
          md: 'p-6',
          lg: 'p-8',
        };
        
        return (
          <div className={\`rounded-xl transition-all duration-200 \${variantClasses[variant]} \${paddingClasses[padding]} \${hoverable ? 'hover:scale-[1.02] cursor-pointer' : ''}\`}>
            {(title || subtitle) && (
              <div className="mb-4 border-b border-gray-100 pb-3">
                {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
              </div>
            )}
            <div className="text-gray-700">{children}</div>
            {footer && <div className="mt-4 pt-3 border-t border-gray-100">{footer}</div>}
          </div>
        );
      },
      
      Input: ({ type = 'text', placeholder, value, onChange, label, error, disabled = false, required = false, fullWidth = true, size = 'md' }) => {
        const sizeClasses = {
          sm: 'px-3 py-1.5 text-sm',
          md: 'px-4 py-2 text-base',
          lg: 'px-5 py-3 text-lg',
        };
        
        return (
          <div className={fullWidth ? 'w-full' : ''}>
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className={\`border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed \${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'} \${sizeClasses[size]} \${fullWidth ? 'w-full' : ''}\`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
      },
      
      Table: ({ columns, data, variant = 'default', hoverable = true, compact = false }) => {
        return (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {columns.map((column) => (
                    <th key={column.key} className={\`font-semibold text-gray-900 bg-gray-50 \${compact ? 'px-3 py-2 text-sm' : 'px-6 py-3'}\`}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className={\`border-b border-gray-100 last:border-0 \${variant === 'striped' && i % 2 === 1 ? 'bg-gray-50' : ''} \${hoverable ? 'hover:bg-gray-50' : ''}\`}>
                    {columns.map((column) => (
                      <td key={column.key} className={\`text-gray-700 \${compact ? 'px-3 py-2 text-sm' : 'px-6 py-4'}\`}>
                        {row[column.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
      
      Modal: ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
        if (!isOpen) return null;
        
        const sizeClasses = {
          sm: 'max-w-sm',
          md: 'max-w-md',
          lg: 'max-w-lg',
          xl: 'max-w-xl',
        };
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className={\`bg-white rounded-2xl shadow-2xl \${sizeClasses[size]} w-full m-4 max-h-[90vh] overflow-hidden flex flex-col\`} onClick={e => e.stopPropagation()}>
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
              )}
              <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
              {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
            </div>
          </div>
        );
      },
      
      Sidebar: ({ items, header, footer, width = 'md', variant = 'default' }) => {
        const widthClasses = { sm: 'w-48', md: 'w-64', lg: 'w-80' };
        const variantClasses = {
          default: 'bg-white border-r border-gray-200',
          dark: 'bg-gray-900 text-white',
        };
        
        return (
          <aside className={\`\${widthClasses[width]} \${variantClasses[variant]} h-full flex flex-col\`}>
            {header && <div className="p-4 border-b border-gray-200">{header}</div>}
            <nav className="flex-1 p-3 overflow-y-auto">
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i}>
                    <button className={\`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all \${item.active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}\`}>
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {footer && <div className="p-4 border-t border-gray-200">{footer}</div>}
          </aside>
        );
      },
      
      Navbar: ({ brand, brandLogo, items = [], rightContent, variant = 'default', sticky = false }) => {
        const variantClasses = {
          default: 'bg-white border-b border-gray-200 text-gray-900',
          dark: 'bg-gray-900 border-b border-gray-800 text-white',
          transparent: 'bg-transparent text-gray-900',
        };
        
        return (
          <nav className={\`\${variantClasses[variant]} \${sticky ? 'sticky top-0 z-40' : ''} shadow-sm\`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  {brandLogo && <div className="text-2xl">{brandLogo}</div>}
                  {brand && <span className="text-xl font-bold">{brand}</span>}
                </div>
                {items.length > 0 && (
                  <div className="hidden md:flex items-center gap-1">
                    {items.map((item, i) => (
                      <button key={i} className={\`px-4 py-2 rounded-lg transition-colors \${item.active ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}\`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
              </div>
            </div>
          </nav>
        );
      },
      
      Chart: ({ data, type = 'bar', title, height = '300px', showLegend = true }) => {
        const maxValue = Math.max(...data.map(d => d.value), 1);
        const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
        
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
            <div style={{ height }}>
              {type === 'bar' && (
                <div className="flex items-end justify-around gap-2 h-full px-4 pb-8">
                  {data.map((point, i) => {
                    const barHeight = (point.value / maxValue) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 max-w-[100px]">
                        <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
                          <span className="text-xs font-semibold text-gray-700 mb-1">{point.value}</span>
                          <div className="w-full rounded-t-lg" style={{ height: \`\${barHeight}%\`, backgroundColor: colors[i % colors.length], minHeight: '4px' }} />
                        </div>
                        <span className="text-xs text-gray-600 mt-2">{point.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {showLegend && (
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {data.map((point, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                    <span className="text-sm text-gray-700">{point.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    };
    
    // Make components available globally
    Object.assign(window, componentLibrary);
    
    try {
      // Transform and evaluate the code
      ${code}
      
      // Render the component
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<GeneratedUI />);
    } catch (error) {
      console.error('Render error:', error);
      document.getElementById('root').innerHTML = \`
        <div class="error-boundary">
          <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">⚠️ Rendering Error</h2>
          <p style="margin-bottom: 0.5rem;">Failed to render the generated UI:</p>
          <pre style="background: white; padding: 1rem; border-radius: 0.25rem; overflow-x: auto; font-size: 0.875rem;">\${error.message}</pre>
        </div>
      \`;
    }
  </script>
</body>
</html>
    `;

    // Write to iframe
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
  }, [code]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const ViewportIcon = viewportSizes[viewport].icon;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Live Preview</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Viewport selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(Object.keys(viewportSizes) as ViewportMode[]).map((mode) => {
              const Icon = viewportSizes[mode].icon;
              return (
                <button
                  key={mode}
                  onClick={() => setViewport(mode)}
                  className={`p-2 rounded transition-colors ${
                    viewport === mode
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={mode}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {error ? (
          <div className="max-w-lg w-full bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Preview Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        ) : code ? (
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
            style={{
              width: viewportSizes[viewport].width,
              height: viewportSizes[viewport].height,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <Maximize2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Generate a UI to see the preview</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-600 text-center">
          Preview updates automatically • Viewport: {viewport}
        </p>
      </div>
    </div>
  );
}
