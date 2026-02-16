# 🏛️ Architecture Documentation

Deep dive into the technical architecture of Ryze UI Generator.

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Component Library](#component-library)
3. [AI Agent System](#ai-agent-system)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow](#data-flow)
7. [Design Decisions](#design-decisions)
8. [Performance Considerations](#performance-considerations)
9. [Security](#security)

---

## 🎯 System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                          │
│                         (Next.js Frontend)                       │
│                                                                   │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Chat Panel   │  │ Code Editor  │  │  Live Preview      │   │
│  │               │  │  (Monaco)    │  │  (Iframe Sandbox)  │   │
│  │  - Messages   │  │  - Syntax    │  │  - Real-time       │   │
│  │  - History    │  │  - Edit      │  │  - Responsive      │   │
│  │  - Actions    │  │  - Download  │  │  - Isolated        │   │
│  └───────┬───────┘  └──────┬───────┘  └─────────┬──────────┘   │
│          │                  │                     │              │
└──────────┼──────────────────┼─────────────────────┼──────────────┘
           │                  │                     │
           ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT                         │
│                     (React useState/Hooks)                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  - messages: ChatMessage[]                               │   │
│  │  - currentCode: string                                   │   │
│  │  - versions: AgentResponse[]                             │   │
│  │  - isGenerating: boolean                                 │   │
│  │  - error: string | null                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER (REST)                          │
│                      /api/generate (POST)                        │
│                                                                   │
│  Request:                        Response:                       │
│  {                               {                               │
│    userIntent: string             success: boolean              │
│    previousCode?: string          data: {                       │
│    isModification: boolean          plan: LayoutPlan            │
│    history: ChatMessage[]           code: GeneratedCode         │
│  }                                  explanation: Explanation     │
│                                   }                              │
│                                 }                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT ORCHESTRATOR                            │
│                   (Business Logic Layer)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Receive request                                       │  │
│  │  2. Determine if modification or fresh generation         │  │
│  │  3. Execute 3-step pipeline                               │  │
│  │  4. Validate each step                                    │  │
│  │  5. Handle errors and recovery                            │  │
│  │  6. Return structured response                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
      ┌──────────────────────────────────────────────┐
      │         3-STEP AI AGENT PIPELINE              │
      │                                                │
      │  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
      │  │ PLANNER  │→ │GENERATOR │→ │ EXPLAINER │  │
      │  └─────┬────┘  └─────┬────┘  └──────┬────┘  │
      │        │             │              │        │
      │        ▼             ▼              ▼        │
      │   JSON Plan    React Code    Explanation    │
      └──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       LLM PROVIDER                               │
│                      (OpenAI GPT-4)                              │
│                                                                   │
│  - Model: gpt-4-turbo-preview                                   │
│  - Temperature: 0.7 (creativity balance)                         │
│  - Max tokens: 2000 (sufficient for UI code)                    │
│  - Response format: JSON (structured output)                    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPONENT LIBRARY                              │
│                  (Deterministic System)                          │
│                                                                   │
│  8 Fixed Components:                                            │
│  ┌───────────┬───────────┬───────────┬───────────┐             │
│  │  Button   │   Card    │  Input    │  Table    │             │
│  ├───────────┼───────────┼───────────┼───────────┤             │
│  │  Modal    │  Sidebar  │  Navbar   │  Chart    │             │
│  └───────────┴───────────┴───────────┴───────────┘             │
│                                                                   │
│  Rules:                                                          │
│  - Immutable implementations                                    │
│  - Props-only configuration                                     │
│  - No new components                                            │
│  - Tailwind CSS only                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧱 Component Library

### Design Philosophy

**Deterministic System:**
- Components are **immutable** - implementation never changes
- Only **props** can be modified
- **No inline styles** or arbitrary CSS
- **Pre-defined variants** for consistency

### Component Structure

```typescript
// Example: Button Component

export interface ButtonProps {
  children: React.ReactNode;          // Content
  variant?: 'primary' | 'secondary';  // Fixed variants
  size?: 'sm' | 'md' | 'lg';         // Fixed sizes
  onClick?: () => void;               // Behavior
  disabled?: boolean;                 // State
  fullWidth?: boolean;                // Layout
}

export const Button: React.FC<ButtonProps> = (props) => {
  // Fixed classes - never change
  const baseClasses = 'font-semibold rounded-lg transition-all';
  
  // Variant mapping - predetermined
  const variantClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-600 text-white',
  };
  
  // Compose classes
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};
```

### Why This Approach?

**Benefits:**
1. **Reproducibility**: Same props → Same output
2. **Safety**: No arbitrary code execution
3. **Maintainability**: Single source of truth
4. **Performance**: Predictable rendering
5. **Testing**: Easy to test fixed components

**Tradeoffs:**
1. Less flexibility (intentional)
2. Limited to defined variants
3. Requires comprehensive component library

---

## 🤖 AI Agent System

### Agent Pipeline Architecture

```
User Input → Planner → Generator → Explainer → Output
              ↓           ↓            ↓
           Validate   Validate    Validate
              ↓           ↓            ↓
           JSON Plan  React Code  Explanation
```

### Agent 1: Planner

**Responsibility:** Interpret intent and create structured plan

**System Prompt Strategy:**
```
- Define available components
- Specify layout options
- Provide examples (few-shot learning)
- Enforce JSON output format
- Include component prop specifications
```

**Input Processing:**
```typescript
interface PlannerInput {
  userIntent: string;
  previousPlan?: LayoutPlan;  // For modifications
  context: ChatMessage[];      // Conversation history
}
```

**Output Structure:**
```typescript
interface LayoutPlan {
  structure: 'single' | 'sidebar-main' | 'dashboard' | ...;
  components: ComponentSelection[];
  reasoning: string;
}

interface ComponentSelection {
  type: 'Button' | 'Card' | ...;
  props: Record<string, any>;
  children?: ComponentSelection[] | string;
}
```

**Validation:**
```typescript
function validatePlan(plan: LayoutPlan): ValidationResult {
  // 1. Check structure is valid
  // 2. Verify all components are in whitelist
  // 3. Validate props against component interfaces
  // 4. Check nesting is logical
}
```

---

### Agent 2: Generator

**Responsibility:** Convert plan to React code

**Code Generation Strategy:**
```
1. Extract component types from plan
2. Generate import statements
3. Choose layout wrapper based on structure
4. Recursively generate component tree
5. Add state management (useState)
6. Include event handlers
7. Format with proper indentation
```

**Template System:**
```typescript
const codeTemplate = `
import React from 'react';
import { ${imports.join(', ')} } from '@/components/library';

export default function GeneratedUI() {
  // State declarations
  ${stateDeclarations}

  return (
    ${layoutWrapper}
      ${componentTree}
    ${layoutWrapperClose}
  );
}
`;
```

**Validation:**
```typescript
function validateCode(code: string): ValidationResult {
  // 1. No inline styles
  // 2. No arbitrary Tailwind values
  // 3. Only allowed imports
  // 4. Valid TypeScript syntax
  // 5. Export present
}
```

---

### Agent 3: Explainer

**Responsibility:** Provide human-readable reasoning

**Explanation Structure:**
```typescript
interface Explanation {
  summary: string;              // High-level overview
  decisions: Decision[];        // Per-component reasoning
  tradeoffs?: string[];        // Alternative approaches
}

interface Decision {
  component: string;            // Component name
  reason: string;               // Why chosen and configured
}
```

**Reasoning Categories:**
1. **Component Selection**: Why this component vs alternatives
2. **Props Configuration**: Why these specific prop values
3. **Layout Choice**: Why this structure fits the use case
4. **Accessibility**: Built-in considerations
5. **Tradeoffs**: What we gave up for this approach

---

### Orchestration Logic

```typescript
async function orchestrateGeneration(request: GenerationRequest) {
  try {
    // Step 1: Planning
    const plan = await plannerAgent.execute(request);
    validatePlan(plan);  // Fail fast if invalid
    
    // Step 2: Code Generation
    const code = generatorAgent.execute(plan);
    validateCode(code);  // Ensure safety
    
    // Step 3: Explanation
    const explanation = explainerAgent.execute(plan, code);
    
    // Assemble response
    return {
      success: true,
      response: { plan, code, explanation }
    };
  } catch (error) {
    // Error handling and recovery
    return handleError(error);
  }
}
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Logo
│   ├── Status Indicator
│   └── Version Counter
├── Error Banner (conditional)
├── Main Layout (3-panel)
│   ├── ChatPanel
│   │   ├── Header
│   │   ├── Messages List
│   │   │   ├── User Message
│   │   │   └── Assistant Message
│   │   ├── Actions (Regenerate, History)
│   │   └── Input Form
│   ├── CodeEditor
│   │   ├── Header (Copy, Download)
│   │   ├── Monaco Editor
│   │   └── Footer (Stats)
│   └── LivePreview
│       ├── Header (Viewport selector)
│       ├── Preview Iframe
│       └── Footer (Info)
└── Footer
```

### State Management

**Why useState over Redux/Zustand:**
- Simple state structure
- No global state needed
- Component-local state
- Easy to understand

**State Structure:**
```typescript
// Main application state
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [currentCode, setCurrentCode] = useState<string>('');
const [versions, setVersions] = useState<AgentResponse[]>([]);
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**State Updates:**
```typescript
// Optimistic updates
setIsGenerating(true);
setMessages(prev => [...prev, newMessage]);

// Error handling
catch (error) {
  setError(error.message);
  setMessages(prev => [...prev, errorMessage]);
}

// Version tracking
setVersions(prev => [...prev, newVersion]);
```

---

### Component Communication

**Props Flow:**
```
Parent (page.tsx)
  ↓ messages, onSendMessage
ChatPanel
  ↑ user message
Parent
  ↓ API call
  ↑ response
  ↓ currentCode
CodeEditor & LivePreview
```

**Callback Pattern:**
```typescript
// Parent defines handlers
const handleSendMessage = (message: string) => {
  generateUI(message);
};

const handleCodeChange = (newCode: string) => {
  setCurrentCode(newCode);
  // Live preview auto-updates
};

// Pass to children
<ChatPanel onSendMessage={handleSendMessage} />
<CodeEditor onChange={handleCodeChange} />
```

---

## 🔧 Backend Architecture

### API Route Structure

```
/app/api/generate/route.ts

POST /api/generate
  → Validate request
  → Call orchestrator
  → Return response

Input: GenerationRequest
Output: OrchestrationResult
```

### Request Flow

```typescript
// 1. Receive request
const body = await request.json();

// 2. Validate
if (!body.userIntent) {
  return error(400, 'Missing userIntent');
}

// 3. Process
const result = await orchestrate(body);

// 4. Respond
return json(result);
```

### Error Handling Strategy

**Layers:**
```
1. API Route Level
   → Catches all errors
   → Returns appropriate HTTP status
   → Logs for debugging

2. Orchestrator Level
   → Catches agent errors
   → Returns step information
   → Allows partial recovery

3. Agent Level
   → Catches LLM errors
   → Validates outputs
   → Retries on transient failures
```

**Error Response Format:**
```typescript
interface ErrorResponse {
  error: string;           // User-friendly message
  step?: string;           // Which agent failed
  details?: string;        // Technical details (dev mode)
  retryable: boolean;     // Can user retry?
}
```

---

## 🔄 Data Flow

### Complete Generation Flow

```
1. User types message
   ↓
2. ChatPanel captures input
   ↓
3. Parent component receives message via callback
   ↓
4. State updates (add user message, set isGenerating)
   ↓
5. API call to /api/generate
   ↓
6. API route validates request
   ↓
7. Orchestrator starts 3-step pipeline
   ↓
8. Planner Agent
   - Calls OpenAI with system prompt + user intent
   - Receives JSON plan
   - Validates plan structure
   ↓
9. Generator Agent
   - Takes plan
   - Generates React code
   - Validates code safety
   ↓
10. Explainer Agent
    - Takes plan + code
    - Generates explanation
    - Formats for user
   ↓
11. Orchestrator assembles response
   ↓
12. API route returns response
   ↓
13. Frontend receives response
   ↓
14. State updates (add assistant message, set code, add version)
   ↓
15. React re-renders
   ↓
16. CodeEditor updates with new code
   ↓
17. LivePreview re-renders with new code
   ↓
18. User sees result
```

### Modification Flow (Iterative)

```
Different from fresh generation:

- previousCode is included in request
- Planner receives existing plan
- Planner makes incremental changes
- Generator modifies existing code (not rebuild)
- Explainer highlights what changed
```

---

## 🎯 Design Decisions

### Why Next.js?

**Pros:**
- ✅ File-based routing
- ✅ API routes (full-stack)
- ✅ TypeScript support
- ✅ Fast Refresh
- ✅ Production-ready
- ✅ Easy deployment (Vercel)

**vs. Create React App:**
- CRA doesn't have built-in API routes
- Would need separate backend
- More complex deployment

**vs. Remix:**
- Next.js has better Vercel integration
- More mature ecosystem
- Better documentation

---

### Why Monaco Editor?

**Pros:**
- ✅ Powers VS Code
- ✅ Syntax highlighting
- ✅ IntelliSense support
- ✅ Rich API

**vs. CodeMirror:**
- Monaco has better TypeScript support
- More features out-of-box

**vs. Plain textarea:**
- No syntax highlighting
- Poor DX for users

---

### Why Iframe for Preview?

**Pros:**
- ✅ Complete isolation
- ✅ CSS doesn't leak
- ✅ Safe execution
- ✅ Full React environment

**vs. Direct rendering:**
- Risk of CSS conflicts
- Security concerns
- Component naming collisions

---

### Why OpenAI over Others?

**Pros:**
- ✅ Best reasoning capabilities
- ✅ JSON mode
- ✅ Reliable API
- ✅ Good documentation

**vs. Anthropic Claude:**
- OpenAI has better JSON mode
- More predictable outputs

**vs. Google Gemini:**
- OpenAI more widely used
- Better for code generation

---

## ⚡ Performance Considerations

### Frontend Optimization

**Code Splitting:**
```typescript
// Monaco editor loaded dynamically
const monaco = await import('monaco-editor');

// Reduces initial bundle size
```

**Memoization:**
```typescript
// Prevent unnecessary re-renders
const memoizedComponent = React.useMemo(
  () => <HeavyComponent data={data} />,
  [data]
);
```

**Debouncing:**
```typescript
// Code editor changes
const debouncedOnChange = useMemo(
  () => debounce(onChange, 300),
  [onChange]
);
```

---

### Backend Optimization

**Caching:**
```typescript
// Cache common prompts (future enhancement)
const promptCache = new Map();

if (promptCache.has(userIntent)) {
  return promptCache.get(userIntent);
}
```

**Parallel Processing:**
```typescript
// Could parallelize validation (future)
const [planValid, codeValid] = await Promise.all([
  validatePlan(plan),
  validateCode(code)
]);
```

---

### API Optimization

**Request Batching:**
```typescript
// Combine multiple small requests (future)
const results = await Promise.all([
  planLayout(request1),
  planLayout(request2),
]);
```

**Streaming Responses:**
```typescript
// Stream LLM responses (future enhancement)
for await (const chunk of streamCompletion()) {
  yield chunk;
}
```

---

## 🔒 Security

### Input Validation

**API Level:**
```typescript
// Validate all inputs
if (!userIntent || typeof userIntent !== 'string') {
  return error(400, 'Invalid input');
}

// Sanitize
const sanitized = userIntent.trim().slice(0, 1000);
```

**Component Level:**
```typescript
// Whitelist validation
const ALLOWED_COMPONENTS = ['Button', 'Card', ...];

if (!ALLOWED_COMPONENTS.includes(componentType)) {
  throw new Error('Invalid component');
}
```

---

### Code Safety

**Validation Rules:**
```typescript
// 1. No eval()
if (code.includes('eval(')) {
  throw new Error('Unsafe code detected');
}

// 2. No inline styles
if (code.includes('style=')) {
  throw new Error('Inline styles not allowed');
}

// 3. Only allowed imports
const allowedImports = ['@/components/library'];
// Validate imports match
```

**Sandbox Isolation:**
```html
<!-- Iframe sandbox attributes -->
<iframe 
  sandbox="allow-scripts allow-same-origin"
  title="Preview"
>
```

---

### API Key Protection

**Environment Variables:**
```typescript
// Never expose in frontend
if (typeof window !== 'undefined') {
  throw new Error('API key accessed in browser');
}

// Use in backend only
const apiKey = process.env.OPENAI_API_KEY;
```

**Rate Limiting:**
```typescript
// Implement rate limiting (future)
const rateLimiter = new RateLimiter({
  max: 10,
  windowMs: 60000
});
```

---

## 📝 Testing Strategy

### Unit Tests

```typescript
// Component tests
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
});

// Agent tests
describe('Planner', () => {
  it('generates valid plan', async () => {
    const plan = await planLayout('Create a button');
    expect(validatePlan(plan).valid).toBe(true);
  });
});
```

### Integration Tests

```typescript
// API tests
describe('POST /api/generate', () => {
  it('returns valid response', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ userIntent: 'Create button' })
    });
    
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

### E2E Tests

```typescript
// Playwright/Cypress
test('complete generation flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('textarea', 'Create a login form');
  await page.click('button[type="submit"]');
  
  await page.waitForSelector('.monaco-editor');
  const code = await page.textContent('.monaco-editor');
  expect(code).toContain('Button');
});
```

---

## 🎓 Lessons Learned

### What Went Well

1. **3-step agent architecture** - Clear separation of concerns
2. **Component library approach** - Ensures consistency
3. **TypeScript** - Caught many bugs early
4. **Next.js** - Fast development, easy deployment

### What Could Be Better

1. **More components** - 8 is limiting for complex UIs
2. **Better state management** - Context API for complex state
3. **Caching** - LLM responses are expensive
4. **Testing** - More comprehensive test coverage

### Future Enhancements

1. **Component marketplace** - User-contributed components
2. **Templates** - Pre-built UI patterns
3. **Export options** - CodeSandbox, StackBlitz integration
4. **Collaboration** - Real-time multi-user editing

---

**End of Architecture Documentation**

For more information, see:
- [README.md](./README.md) - Project overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment instructions
- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) - Video recording guide
