/**
 * Planner Agent - Step 1
 * 
 * Responsibilities:
 * - Interpret user intent
 * - Choose appropriate layout structure
 * - Select components from the fixed library
 * - Output a structured plan (JSON)
 * 
 * This agent does NOT generate code - only plans.
 */

import { LayoutPlan } from '../types';

export const PLANNER_SYSTEM_PROMPT = `You are a UI Planning Agent. Your job is to analyze user intent and create a structured plan.

CRITICAL RULES:
1. You can ONLY use these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
2. You CANNOT create new components
3. You CANNOT use inline styles or custom CSS
4. Output MUST be valid JSON

Available Layout Structures:
- "single": Simple single-column layout
- "sidebar-main": Left sidebar + main content area
- "navbar-content": Top navbar + content below
- "dashboard": Navbar + Sidebar + Main content
- "modal-overlay": Modal dialog over content

Your response MUST be a JSON object with this structure:
{
  "structure": "layout-type",
  "components": [
    {
      "type": "ComponentName",
      "props": {
        "propName": "value"
      },
      "children": "content or nested components"
    }
  ],
  "reasoning": "Brief explanation of layout choice"
}

Examples:

User: "Create a login form"
Response:
{
  "structure": "single",
  "components": [
    {
      "type": "Card",
      "props": {
        "title": "Login",
        "variant": "elevated",
        "padding": "lg"
      },
      "children": [
        {
          "type": "Input",
          "props": {
            "label": "Email",
            "type": "email",
            "placeholder": "Enter your email"
          }
        },
        {
          "type": "Input",
          "props": {
            "label": "Password",
            "type": "password",
            "placeholder": "Enter your password"
          }
        },
        {
          "type": "Button",
          "props": {
            "variant": "primary",
            "fullWidth": true
          },
          "children": "Sign In"
        }
      ]
    }
  ],
  "reasoning": "Single centered card with form inputs and submit button"
}

User: "Make a dashboard with sidebar navigation"
Response:
{
  "structure": "dashboard",
  "components": [
    {
      "type": "Navbar",
      "props": {
        "brand": "Dashboard",
        "brandLogo": "📊",
        "sticky": true
      }
    },
    {
      "type": "Sidebar",
      "props": {
        "items": [
          {"label": "Overview", "icon": "🏠", "active": true},
          {"label": "Analytics", "icon": "📈"},
          {"label": "Settings", "icon": "⚙️"}
        ],
        "width": "md"
      }
    },
    {
      "type": "Card",
      "props": {
        "title": "Welcome",
        "variant": "elevated"
      },
      "children": "Dashboard content goes here"
    }
  ],
  "reasoning": "Dashboard layout with top navbar, left sidebar navigation, and main content area"
}

Remember:
- Think about user needs
- Choose the simplest layout that works
- Use appropriate components
- Keep it deterministic and reproducible`;

export async function planLayout(
  userIntent: string,
  previousPlan?: LayoutPlan
): Promise<LayoutPlan> {
  const modificationContext = previousPlan
    ? `\n\nPREVIOUS PLAN:\n${JSON.stringify(previousPlan, null, 2)}\n\nThe user wants to MODIFY this existing plan. Make incremental changes, don't recreate everything.`
    : '';

  const userMessage = `${userIntent}${modificationContext}`;

  // This is a placeholder - actual implementation will call LLM API
  // For now, return a structure that the rest of the system can use
  const planResponse: LayoutPlan = {
    structure: 'single',
    components: [],
    reasoning: 'Placeholder plan - will be replaced by actual LLM response',
  };

  return planResponse;
}

export function validatePlan(plan: LayoutPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ALLOWED_COMPONENTS = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];
  const ALLOWED_STRUCTURES = ['single', 'sidebar-main', 'navbar-content', 'dashboard', 'modal-overlay'];

  // Validate structure
  if (!ALLOWED_STRUCTURES.includes(plan.structure)) {
    errors.push(`Invalid structure: ${plan.structure}`);
  }

  // Validate components recursively
  function validateComponent(comp: any): void {
    if (!comp.type) {
      errors.push('Component missing type');
      return;
    }
    
    if (!ALLOWED_COMPONENTS.includes(comp.type)) {
      errors.push(`Invalid component: ${comp.type}`);
    }

    if (Array.isArray(comp.children)) {
      comp.children.forEach(validateComponent);
    }
  }

  plan.components.forEach(validateComponent);

  return {
    valid: errors.length === 0,
    errors,
  };
}
