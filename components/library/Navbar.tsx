import React from 'react';

export interface NavbarItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface NavbarProps {
  brand?: string;
  brandLogo?: string;
  items?: NavbarItem[];
  rightContent?: React.ReactNode;
  variant?: 'default' | 'dark' | 'transparent';
  sticky?: boolean;
}

/**
 * Navbar Component
 * 
 * A top navigation bar with brand, menu items, and right-side content.
 * Supports sticky positioning and different visual variants.
 * 
 * Usage:
 * <Navbar 
 *   brand="My App"
 *   items={[{label: 'Home', active: true}, {label: 'About'}]}
 *   variant="default"
 *   sticky={true}
 * />
 */
export const Navbar: React.FC<NavbarProps> = ({
  brand,
  brandLogo,
  items = [],
  rightContent,
  variant = 'default',
  sticky = false,
}) => {
  const variantClasses = {
    default: 'bg-white border-b border-gray-200 text-gray-900',
    dark: 'bg-gray-900 border-b border-gray-800 text-white',
    transparent: 'bg-transparent text-gray-900',
  };
  
  const itemVariantClasses = {
    default: {
      normal: 'text-gray-700 hover:text-primary-600',
      active: 'text-primary-600 font-semibold',
    },
    dark: {
      normal: 'text-gray-300 hover:text-white',
      active: 'text-white font-semibold',
    },
    transparent: {
      normal: 'text-gray-700 hover:text-primary-600',
      active: 'text-primary-600 font-semibold',
    },
  };
  
  const stickyClass = sticky ? 'sticky top-0 z-40' : '';
  
  return (
    <nav className={`${variantClasses[variant]} ${stickyClass} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {brandLogo && (
              <div className="text-2xl">{brandLogo}</div>
            )}
            {brand && (
              <span className="text-xl font-bold">{brand}</span>
            )}
          </div>
          
          {/* Navigation Items */}
          {items.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`
                    px-4 py-2 rounded-lg transition-colors duration-200
                    ${item.active 
                      ? itemVariantClasses[variant].active 
                      : itemVariantClasses[variant].normal
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Right Content */}
          {rightContent && (
            <div className="flex items-center gap-2">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
