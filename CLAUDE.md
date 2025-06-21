# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fastmail Bridge is an SMTP bridge service designed to enable platforms without native SMTP support (like Deno and Cloudflare) to send emails through Fastmail. Built with Bun runtime and Hono web framework using TypeScript.

## Common Development Commands

### Running the Development Server
```bash
bun run dev
```
This starts the server with hot reload on port 3000.

### Installing Dependencies
```bash
bun install
```

## Architecture and Structure

### Technology Stack
- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Framework**: Hono (lightweight web framework)
- **Language**: TypeScript with strict mode enabled

### Project Structure
- `src/index.ts` - Main application entry point containing the Hono server setup
- Currently implements only a basic "Hello Hono!" endpoint
- SMTP bridge functionality needs to be implemented

### Key Implementation Notes
- The project is configured to run on port 3000 by default
- TypeScript is configured with:
  - Strict mode enabled
  - JSX support for Hono's JSX capabilities
  - ES2020 target with ESNext module resolution

### Future Implementation Considerations
When implementing the SMTP bridge functionality:
- Consider implementing authentication for API endpoints
- Handle Fastmail SMTP credentials securely
- Implement proper error handling and logging
- Add rate limiting to prevent abuse
- Consider adding queue management for email sending