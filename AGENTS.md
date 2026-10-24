# AI Agents Instructions for Hexo

This document provides essential context and conventions to help AI agents be productive when contributing to the Hexo core.

## 🛠 Development Workflow

### Build and Test
- **Build**: `npm run build` (compiles TypeScript via `tsc -b`)
- **Clean**: `npm run clean`
- **Lint**: `npm run eslint`
- **Test**: `npm test` (runs Mocha tests)
- **Coverage**: `npm run test-cov`

### Core Architecture
Hexo is built as a plugin-based static site generator.
- **Central Orchestrator**: `lib/hexo/index.ts` manages the lifecycle, configuration, and plugin registration.
- **Extensibility Layer (`lib/extend`)**:
    - **Filters**: Pipeline hooks (e.g., `post_permalink`).
    - **Generators**: Responsible for creating the final static files.
    - **Helpers**: Utility functions available in templates.
    - **Tags**: Custom markdown tags.
- **Data Models (`lib/models`)**: Defines the schema for Posts, Pages, etc., using the `warehouse` database.
- **Plugins (`lib/plugins`)**: Contains default implementations of the extend system.

## 📏 Coding Conventions

### TypeScript & Promises
- **Language**: TypeScript.
- **Promise Library**: Heavy reliance on `bluebird`. Be mindful of Bluebird-specific methods like `.tap()` and `.tapCatch()` which may be used in core paths.
- **Async/Await**: Preferred, but ensure compatibility when interacting with Bluebird-based chains.

### Service Location
- The `ctx` (Hexo instance) is passed throughout the application and serves as the primary way to access configuration, models, and the extend registries.

## ⚠️ Common Pitfalls
- **Filter Order**: The sequence of filters (e.g., `before_generate` $\rightarrow$ `after_render`) is critical for correct output. Always verify where a new filter fits in the pipeline.
- **Global State**: Avoid introducing new global states; prefer attaching functionality to the `ctx` instance or the extend registries.

## 📚 Reference Examples
When implementing new features, refer to these representative files:
- **Filter**: `lib/plugins/filter/post_permalink.ts`
- **Generator**: `lib/plugins/generator/post.ts`
- **Helper**: `lib/plugins/helper/date.ts`
- **Model**: `lib/models/post.ts`

## 🔗 Documentation
- [Contributing Guide](.github/CONTRIBUTING.md)
- [Project README](README.md)
