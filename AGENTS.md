# AGENTS.md

## AI Coding Guidelines

When implementing a feature:

1. Reuse existing components before creating new ones.
2. Follow the existing folder structure.
3. Keep changes as small as possible.
4. Explain complex logic with concise comments.
5. Do not introduce new dependencies without a clear reason.
6. Ask for clarification instead of making assumptions about business rules.
7. Prefer composition over inheritance.

## Project

Build a simple, modern booking application.

Priorities:
- Simple architecture
- Readable TypeScript
- Reusable components
- Mobile-first responsive design
- Maintainable code over clever code

---

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- ESLint + Prettier

Do not add additional libraries unless they provide significant value.

---

## Design

Create a clean, flat UI.

### Style

- White surfaces
- Light gray background
- Blue primary color
- Rounded corners
- Minimal shadows
- No gradients
- No glassmorphism
- No excessive animations

### Colors

Primary: #2563EB

Background: #F8FAFC

Surface: #FFFFFF

Border: #E2E8F0

Text Primary: #0F172A

Text Secondary: #64748B

Success: #22C55E

Warning: #F59E0B

Danger: #EF4444

---

## Tailwind

Always prefer Tailwind utilities.

Keep class lists readable.

Extract repeated UI into reusable components.

Avoid custom CSS unless absolutely necessary.

---

## Project Structure

```
src/
  assets/
  components/
    common/
    booking/
    layout/

  pages/

  layouts/

  hooks/

  services/

  types/

  utils/

  constants/

  router/

  App.tsx
  main.tsx
```

---

## TypeScript Rules

Always use TypeScript.

Never use:

- any
- @ts-ignore

Prefer:

- interfaces for object models
- type aliases for unions
- strict typing
- typed props
- typed API responses

Example:

```ts
interface Booking {
  id: string;
  customerName: string;
  checkIn: string;
  checkOut: string;
}
```

---

## Components

Prefer small components.

Keep components focused on one responsibility.

Extract repeated JSX.

Avoid components larger than ~150 lines.

---

## State

Use:

- useState
- useEffect
- useMemo
- useCallback when needed

Do not introduce Redux, MobX, or Zustand unless requested.

---

## API

Keep API logic inside:

```
services/
```

Never place fetch calls directly inside page components unless trivial.

Always strongly type request and response models.

---

## Forms

Use controlled inputs.

Validate user input.

Show loading indicators.

Display friendly error messages.

---

## Accessibility

Use semantic HTML.

Associate labels with inputs.

Support keyboard navigation.

Maintain visible focus styles.

---

## Responsive

Design mobile first.

Support:

- Mobile
- Tablet
- Desktop

---

## Definition of Done

Every feature should:

- Compile without TypeScript errors
- Pass ESLint
- Be responsive
- Handle loading state
- Handle empty state
- Handle error state
- Reuse existing components where possible
- Follow the established design system

---

## General Rules

Prefer:

- Simplicity
- Readability
- Reusability
- Consistency

Avoid:

- Over-engineering
- Premature abstraction
- Unnecessary dependencies
- Duplicate code