# 🤝 Contributing to Ryze UI Generator

Thank you for your interest in contributing! This project was built for the Ryze AI assignment, but contributions are welcome for improvements and learning.

---

## 🎯 Ways to Contribute

1. **Report bugs** - Found an issue? Open a GitHub issue
2. **Suggest features** - Have ideas? Create a feature request
3. **Improve documentation** - Fix typos, add examples
4. **Add components** - Expand the component library
5. **Optimize code** - Performance improvements welcome

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ryze-ui-generator.git
cd ryze-ui-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict types
- **Format**: 2 spaces, no semicolons
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Explain why, not what

**Example:**
```typescript
// Good
const userInput = sanitizeInput(rawInput);

// Bad
const ui = clean(x);
```

---

### Component Guidelines

**When adding new components:**

1. Follow existing component structure
2. Use TypeScript interfaces for props
3. Include JSDoc comments
4. Export from library/index.ts
5. Add to ALLOWED_COMPONENTS list
6. Update README

**Template:**
```typescript
export interface NewComponentProps {
  // Props here
}

/**
 * NewComponent Description
 * 
 * Usage:
 * <NewComponent prop="value" />
 */
export const NewComponent: React.FC<NewComponentProps> = (props) => {
  // Implementation
};
```

---

### Testing

```bash
# Run tests (when added)
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

---

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new Chart component
fix: resolve Monaco editor loading issue
docs: update README with new examples
refactor: simplify agent orchestrator
test: add unit tests for planner agent
```

---

## 🔄 Pull Request Process

### 1. Update Your Fork

```bash
# Add upstream remote
git remote add upstream https://github.com/original/ryze-ui-generator.git

# Fetch and merge
git fetch upstream
git merge upstream/main
```

---

### 2. Make Changes

- Write clean, documented code
- Follow existing patterns
- Test your changes
- Update documentation

---

### 3. Submit PR

```bash
# Push your branch
git push origin feature/your-feature-name
```

Then on GitHub:
1. Click "New Pull Request"
2. Select your branch
3. Fill in the template
4. Submit!

---

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How you tested the changes

## Screenshots
If UI changes, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested locally
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version
4. Gather information

---

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- OpenAI model: [e.g., gpt-4-turbo]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

---

## 💡 Feature Requests

### Template

```markdown
## Feature Description
What feature you'd like

## Use Case
Why this feature is needed

## Proposed Solution
How you think it could work

## Alternatives
Other approaches considered

## Additional Context
Mockups, examples, etc.
```

---

## 🎨 Component Library Expansion

**Want to add a new component?**

### Requirements

1. **Deterministic** - Same props → Same output
2. **No inline styles** - Tailwind only
3. **Typed props** - Full TypeScript
4. **Accessible** - ARIA labels, keyboard nav
5. **Responsive** - Mobile-first
6. **Documented** - JSDoc + examples

---

### Example PR: Adding Checkbox Component

```typescript
// components/library/Checkbox.tsx

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Checkbox Component
 * 
 * A deterministic checkbox with label support.
 * 
 * Usage:
 * <Checkbox 
 *   label="Remember me" 
 *   checked={isChecked}
 *   onChange={setIsChecked}
 * />
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className={`${sizeClasses[size]} text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {label && (
        <span className="text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
};
```

**Then:**
1. Export from `library/index.ts`
2. Add to `ALLOWED_COMPONENTS`
3. Update agent prompts
4. Add examples to README
5. Submit PR

---

## 📚 Documentation Updates

**Documentation lives in:**
- README.md - Main overview
- ARCHITECTURE.md - Technical details
- DEPLOYMENT_GUIDE.md - Deployment steps
- QUICK_START.md - Fast setup
- Code comments - Inline docs

**When to update:**
- New features → README + ARCHITECTURE
- API changes → ARCHITECTURE
- Setup changes → QUICK_START + DEPLOYMENT_GUIDE
- Bug fixes → Usually no docs needed

---

## 🧪 Testing (Future)

**When tests are added:**

```typescript
// Example test structure

describe('Button Component', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click</Button>);
    const button = screen.getByText('Click');
    expect(button).toHaveClass('bg-primary-600');
  });
});

describe('Planner Agent', () => {
  it('generates valid plan for simple input', async () => {
    const plan = await planLayout('Create a button');
    expect(validatePlan(plan).valid).toBe(true);
  });
});
```

---

## ⚡ Performance Tips

**When optimizing:**

1. **Profile first** - Use React DevTools
2. **Measure impact** - Before/after benchmarks
3. **Document changes** - Explain why
4. **Avoid premature optimization** - Focus on bottlenecks

**Common optimizations:**
- `React.memo` for expensive components
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- Code splitting with dynamic imports
- Debouncing user inputs

---

## 🔒 Security

**Security is important!**

### If you find a security issue:

**DO:**
- Email maintainer directly
- Provide details privately
- Wait for fix before disclosure

**DON'T:**
- Open public issue
- Post on social media
- Exploit the vulnerability

---

## 💬 Communication

**Have questions?**

1. Check existing issues
2. Read documentation
3. Create discussion (GitHub Discussions)
4. Be respectful and patient

---

## 🎓 Learning Resources

**Want to contribute but new to:**

**Next.js:**
- [Official Tutorial](https://nextjs.org/learn)
- [Documentation](https://nextjs.org/docs)

**TypeScript:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)

**Tailwind CSS:**
- [Documentation](https://tailwindcss.com/docs)
- [Playground](https://play.tailwindcss.com/)

**OpenAI API:**
- [API Reference](https://platform.openai.com/docs/api-reference)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

## 🌟 Recognition

**Contributors will be:**
- Listed in README
- Mentioned in releases
- Credited in commit history

Thank you for making this project better! 🙏

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?**

Feel free to:
- Open an issue
- Start a discussion
- Reach out to maintainers

Happy contributing! 🚀
