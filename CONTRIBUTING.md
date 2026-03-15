# Contributing to CampusSync

Thank you for your interest in contributing to CampusSync! To maintain high code quality and consistency, we follow these guidelines.

## Development Workflow

1.  **Repository Structure**:
    *   `backend/`: Node.js + Express server and AI configuration.
    *   `frontend/public/`: Static frontend assets and HTML views.
    *   `tests/`: Automated testing suite.

2.  **Naming Conventions**:
    *   Use `camelCase` for variable and function names.
    *   Use `kebab-case` for directory and file names (except for utility classes).

3.  **Code Standards**:
    *   Document all public functions with **JSDoc**.
    *   Keep logic modular: separate AI prompt engineering from API route handling.
    *   Use structured logging (`info`, `success`, `error`).

4.  **Testing**:
    *   Run tests using `npm test` before pushing any changes.
    *   Maintain a high level of code coverage for core AI logic.

## Environment Setup

Ensure you have a `.env` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_key_here
PORT=3000
```

## Branching Strategy

*   `main`: Production-ready code.
*   `feature/*`: New features and enhancements.
*   `bugfix/*`: Critical bug fixes.

---
Built with ❤️ for the university community.
