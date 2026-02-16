/**
 * Explainer Agent - Step 3
 * 
 * Responsibilities:
 * - Explain why specific components were chosen
 * - Describe the layout reasoning
 * - Highlight any tradeoffs or alternatives
 * - Make decisions transparent and understandable
 * 
 * This agent focuses on clarity and education.
 */

import { LayoutPlan, GeneratedCode, Explanation } from '../types';

export const EXPLAINER_SYSTEM_PROMPT = `You are a UI Explanation Agent. Your job is to explain UI generation decisions in plain English.

Your response should help the user understand:
1. WHY you chose this layout structure
2. WHY you selected specific components
3. WHAT alternatives you considered
4. WHAT tradeoffs were made

Output format:
{
  "summary": "Brief 1-2 sentence overview of what was created",
  "decisions": [
    {
      "component": "ComponentName",
      "reason": "Why this component was chosen and how it's configured"
    }
  ],
  "tradeoffs": [
    "Alternative approach that wasn't used and why"
  ]
}

Example:

For a login form:
{
  "summary": "Created a centered login form with email and password inputs in an elevated card.",
  "decisions": [
    {
      "component": "Card",
      "reason": "Used an elevated Card variant to make the form stand out from the background and create visual hierarchy"
    },
    {
      "component": "Input",
      "reason": "Two Input components with proper labels and types (email/password) for accessibility and validation"
    },
    {
      "component": "Button",
      "reason": "Primary variant button with full width for clear call-to-action"
    }
  ],
  "tradeoffs": [
    "Could have used a Modal instead of Card, but Card is better for primary login flows",
    "Could add a 'Remember Me' checkbox, but kept it minimal per request"
  ]
}

Guidelines:
- Be concise but informative
- Focus on user benefit, not technical details
- Mention accessibility considerations
- Explain component prop choices
- Note any design patterns followed`;

export function generateExplanation(
  plan: LayoutPlan,
  code: GeneratedCode
): Explanation {
  // Extract component decisions from plan
  const decisions = extractDecisions(plan);

  // Generate summary
  const summary = generateSummary(plan);

  // Consider tradeoffs
  const tradeoffs = considerTradeoffs(plan);

  return {
    summary,
    decisions,
    tradeoffs,
  };
}

function extractDecisions(plan: LayoutPlan): Array<{ component: string; reason: string }> {
  const decisions: Array<{ component: string; reason: string }> = [];

  // Add layout decision
  decisions.push({
    component: `Layout (${plan.structure})`,
    reason: plan.reasoning,
  });

  // Extract component-specific decisions
  function extractFromComponents(components: any[]): void {
    components.forEach(comp => {
      const reasonParts: string[] = [];

      // Explain variant choice
      if (comp.props.variant) {
        reasonParts.push(`Using '${comp.props.variant}' variant`);
      }

      // Explain sizing
      if (comp.props.size) {
        reasonParts.push(`${comp.props.size} size for ${comp.props.size === 'lg' ? 'emphasis' : 'balance'}`);
      }

      // Explain behavioral props
      if (comp.props.fullWidth) {
        reasonParts.push('full width for better mobile experience');
      }

      if (comp.props.sticky) {
        reasonParts.push('sticky positioning for persistent navigation');
      }

      const reason = reasonParts.length > 0 
        ? reasonParts.join(', ')
        : `Standard ${comp.type} component for this use case`;

      decisions.push({
        component: comp.type,
        reason,
      });

      // Recurse into children
      if (Array.isArray(comp.children)) {
        const childComponents = comp.children.filter((c: any) => typeof c !== 'string');
        if (childComponents.length > 0) {
          extractFromComponents(childComponents);
        }
      }
    });
  }

  extractFromComponents(plan.components);

  return decisions;
}

function generateSummary(plan: LayoutPlan): string {
  const componentCount = countComponents(plan.components);
  const layoutDesc = {
    single: 'a centered single-column layout',
    'sidebar-main': 'a layout with sidebar navigation and main content area',
    'navbar-content': 'a layout with top navigation bar',
    dashboard: 'a full dashboard with navbar, sidebar, and content area',
    'modal-overlay': 'a modal dialog overlay',
  }[plan.structure] || 'a custom layout';

  const mainComponents = plan.components
    .map(c => c.type)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3)
    .join(', ');

  return `Created ${layoutDesc} using ${componentCount} components including ${mainComponents}.`;
}

function countComponents(components: any[]): number {
  let count = 0;

  function countRecursive(comps: any[]): void {
    comps.forEach(comp => {
      count++;
      if (Array.isArray(comp.children)) {
        const childComponents = comp.children.filter((c: any) => typeof c !== 'string');
        if (childComponents.length > 0) {
          countRecursive(childComponents);
        }
      }
    });
  }

  countRecursive(components);
  return count;
}

function considerTradeoffs(plan: LayoutPlan): string[] {
  const tradeoffs: string[] = [];

  // Layout tradeoffs
  if (plan.structure === 'single') {
    tradeoffs.push('Simple layout prioritizes focus over navigation complexity');
  } else if (plan.structure === 'dashboard') {
    tradeoffs.push('Dashboard layout provides rich navigation but requires more screen space');
  }

  // Component tradeoffs
  const hasModal = plan.components.some(c => c.type === 'Modal');
  if (hasModal) {
    tradeoffs.push('Modal provides focus but may interrupt user flow - consider inline alternatives for less critical actions');
  }

  const hasTable = plan.components.some(c => c.type === 'Table');
  if (hasTable) {
    tradeoffs.push('Table is great for data but less mobile-friendly - consider Card grid for responsive layouts');
  }

  const hasSidebar = plan.components.some(c => c.type === 'Sidebar');
  if (hasSidebar) {
    tradeoffs.push('Sidebar navigation is efficient but may need hamburger menu on mobile');
  }

  return tradeoffs;
}

export function formatExplanationForUser(explanation: Explanation): string {
  let output = `## ${explanation.summary}\n\n`;

  output += '### Design Decisions\n';
  explanation.decisions.forEach(decision => {
    output += `- **${decision.component}**: ${decision.reason}\n`;
  });

  if (explanation.tradeoffs && explanation.tradeoffs.length > 0) {
    output += '\n### Considerations\n';
    explanation.tradeoffs.forEach(tradeoff => {
      output += `- ${tradeoff}\n`;
    });
  }

  return output;
}
