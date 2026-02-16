import React from 'react';

export interface SidebarItem {
  label: string;
  icon?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark';
}

/**
 * Sidebar Component
 * 
 * A navigation sidebar with items, header, and footer.
 * Fixed width options and two visual variants.
 * 
 * Usage:
 * <Sidebar 
 *   items={[
 *     {label: 'Dashboard', icon: '📊', active: true},
 *     {label: 'Settings', icon: '⚙️'}
 *   ]}
 *   width="md"
 * />
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  header,
  footer,
  width = 'md',
  variant = 'default',
}) => {
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };
  
  const variantClasses = {
    default: 'bg-white border-r border-gray-200',
    dark: 'bg-gray-900 text-white',
  };
  
  const itemBaseClasses = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer';
  const itemVariantClasses = {
    default: {
      normal: 'text-gray-700 hover:bg-gray-100',
      active: 'bg-primary-50 text-primary-700 font-semibold',
    },
    dark: {
      normal: 'text-gray-300 hover:bg-gray-800',
      active: 'bg-primary-600 text-white font-semibold',
    },
  };
  
  return (
    <aside className={`${widthClasses[width]} ${variantClasses[variant]} h-full flex flex-col`}>
      {/* Header */}
      {header && (
        <div className="p-4 border-b border-gray-200">
          {header}
        </div>
      )}
      
      {/* Navigation Items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`
                  ${itemBaseClasses}
                  ${item.active 
                    ? itemVariantClasses[variant].active 
                    : itemVariantClasses[variant].normal
                  }
                  w-full text-left
                `}
              >
                {item.icon && <span className="text-xl">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </aside>
  );
};
