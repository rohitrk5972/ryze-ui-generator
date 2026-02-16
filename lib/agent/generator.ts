/**
 * Generator Agent - Step 2
 * 
 * Responsibilities:
 * - Take the structured plan from Planner
 * - Generate valid React/TypeScript code
 * - Use ONLY allowed components from the library
 * - Produce clean, formatted code
 * 
 * This agent does NOT make design decisions - it only translates the plan.
 */

import { LayoutPlan, GeneratedCode, ComponentSelection } from '../types';

export const GENERATOR_SYSTEM_PROMPT = `You are a Code Generation Agent. Your job is to convert a structured plan into valid React code.

CRITICAL RULES:
1. ONLY use imports from: 'import { ComponentName } from "@/components/library"'
2. NO inline styles
3. NO custom CSS classes beyond what components provide
4. NO external libraries
5. Generate a SINGLE React component called "GeneratedUI"
6. Code must be valid TypeScript/React

Template structure:
\`\`\`tsx
import React from 'react';
import { Button, Card, Input } from '@/components/library';

export default function GeneratedUI() {
  // State management if needed
  const [state, setState] = React.useState(initialValue);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your component structure here */}
    </div>
  );
}
\`\`\`

Layout Structure Examples:

1. Single Layout:
\`\`\`tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div className="w-full max-w-md">
    {/* Components */}
  </div>
</div>
\`\`\`

2. Dashboard Layout (Navbar + Sidebar + Main):
\`\`\`tsx
<div className="min-h-screen bg-gray-50">
  <Navbar {...props} />
  <div className="flex">
    <Sidebar {...props} />
    <main className="flex-1 p-6">
      {/* Main content */}
    </main>
  </div>
</div>
\`\`\`

3. Sidebar-Main Layout:
\`\`\`tsx
<div className="min-h-screen bg-gray-50 flex">
  <Sidebar {...props} />
  <main className="flex-1 p-6">
    {/* Content */}
  </main>
</div>
\`\`\`

Component Usage Examples:

Button:
<Button variant="primary" size="md" onClick={() => alert('Clicked')}>
  Click Me
</Button>

Card:
<Card title="My Card" variant="elevated" padding="md">
  <p>Content here</p>
</Card>

Input:
<Input 
  label="Email"
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

Table:
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' }
  ]}
  data={[
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
  ]}
  variant="striped"
/>

Modal:
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
</Modal>

Chart:
<Chart
  type="bar"
  title="Sales Data"
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 }
  ]}
  showLegend={true}
/>

Remember:
- Generate clean, readable code
- Add comments for clarity
- Include proper state management with React.useState
- Handle events with inline arrow functions
- Use TypeScript types properly`;

export function generateCodeFromPlan(plan: LayoutPlan): GeneratedCode {
  try {
    // Extract unique component types
    const componentTypes = extractComponentTypes(plan.components);
    
    // Generate imports
    const imports = [
      "import React from 'react';",
      `import { ${componentTypes.join(', ')} } from '@/components/library';`,
    ];

    // Generate layout wrapper based on structure
    const layoutWrapper = getLayoutWrapper(plan.structure);

    // Generate component tree
    const componentCode = generateComponentTree(plan.components, 1);

    // Combine into full code
    const code = `${imports.join('\n')}

export default function GeneratedUI() {
  // State management
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
${layoutWrapper.opening}
${componentCode}
${layoutWrapper.closing}
  );
}`;

    return {
      code,
      imports: componentTypes,
      valid: true,
    };
  } catch (error) {
    return {
      code: '',
      imports: [],
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

function extractComponentTypes(components: ComponentSelection[]): string[] {
  const types = new Set<string>();

  function extract(comp: ComponentSelection | ComponentSelection[]): void {
    if (Array.isArray(comp)) {
      comp.forEach(extract);
    } else {
      types.add(comp.type);
      if (Array.isArray(comp.children)) {
        comp.children.forEach(child => {
          if (typeof child !== 'string') extract(child);
        });
      }
    }
  }

  components.forEach(extract);
  return Array.from(types);
}

function getLayoutWrapper(structure: string): { opening: string; closing: string } {
  const wrappers = {
    single: {
      opening: '    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">\n      <div className="w-full max-w-2xl">',
      closing: '      </div>\n    </div>',
    },
    'sidebar-main': {
      opening: '    <div className="min-h-screen bg-gray-50 flex">',
      closing: '    </div>',
    },
    'navbar-content': {
      opening: '    <div className="min-h-screen bg-gray-50">',
      closing: '    </div>',
    },
    dashboard: {
      opening: '    <div className="min-h-screen bg-gray-50">',
      closing: '    </div>',
    },
    'modal-overlay': {
      opening: '    <div className="min-h-screen bg-gray-50 p-4">',
      closing: '    </div>',
    },
  };

  return wrappers[structure as keyof typeof wrappers] || wrappers.single;
}

function generateComponentTree(
  components: ComponentSelection[],
  indent: number = 0
): string {
  const indentStr = '  '.repeat(indent + 2);

  return components
    .map(comp => {
      const propsStr = Object.entries(comp.props)
        .map(([key, value]) => {
          if (typeof value === 'boolean') {
            return value ? key : '';
          }
          if (typeof value === 'string') {
            return `${key}="${value}"`;
          }
          return `${key}={${JSON.stringify(value)}}`;
        })
        .filter(Boolean)
        .join(' ');

      const hasProps = propsStr.length > 0;

      // Handle children
      if (Array.isArray(comp.children)) {
        const childrenCode = comp.children
          .map(child => {
            if (typeof child === 'string') {
              return `${indentStr}  ${child}`;
            }
            return generateComponentTree([child], indent + 1);
          })
          .join('\n');

        return `${indentStr}<${comp.type}${hasProps ? ' ' + propsStr : ''}>
${childrenCode}
${indentStr}</${comp.type}>`;
      } else if (typeof comp.children === 'string') {
        return `${indentStr}<${comp.type}${hasProps ? ' ' + propsStr : ''}>${comp.children}</${comp.type}>`;
      } else {
        return `${indentStr}<${comp.type}${hasProps ? ' ' + propsStr : ''} />`;
      }
    })
    .join('\n');
}

export function validateGeneratedCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for forbidden patterns
  if (code.includes('style=') || code.includes('style =')) {
    errors.push('Inline styles detected');
  }

  if (code.match(/className="[^"]*\b(bg-\[|text-\[|border-\[)/)) {
    errors.push('Arbitrary Tailwind values detected');
  }

  // Check for required imports
  if (!code.includes("from '@/components/library'")) {
    errors.push('Missing component library import');
  }

  // Check for function declaration
  if (!code.includes('export default function GeneratedUI')) {
    errors.push('Missing GeneratedUI function export');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
