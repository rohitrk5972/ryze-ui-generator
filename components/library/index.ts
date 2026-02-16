/**
 * Fixed Component Library
 * 
 * This is the DETERMINISTIC component library for the UI Generator.
 * 
 * CRITICAL RULES:
 * 1. Component implementations NEVER change
 * 2. Only props can be modified
 * 3. AI cannot create new components
 * 4. AI cannot modify component styling
 * 5. AI can only: select, compose, and configure these components
 * 
 * Available Components:
 * - Button: Interactive button with variants
 * - Card: Content container with header/footer
 * - Input: Form input with label and validation
 * - Table: Data table with columns
 * - Modal: Dialog overlay
 * - Sidebar: Navigation sidebar
 * - Navbar: Top navigation bar
 * - Chart: Data visualization (bar/line/pie)
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Table } from './Table';
export type { TableProps, TableColumn } from './Table';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Sidebar } from './Sidebar';
export type { SidebarProps, SidebarItem } from './Sidebar';

export { Navbar } from './Navbar';
export type { NavbarProps, NavbarItem } from './Navbar';

export { Chart } from './Chart';
export type { ChartProps, ChartDataPoint } from './Chart';

/**
 * Component Registry
 * Used by the AI agent to validate component usage
 */
export const ALLOWED_COMPONENTS = [
  'Button',
  'Card',
  'Input',
  'Table',
  'Modal',
  'Sidebar',
  'Navbar',
  'Chart',
] as const;

export type AllowedComponent = typeof ALLOWED_COMPONENTS[number];
