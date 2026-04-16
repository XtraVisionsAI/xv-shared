# @xv-shared/ts-config

Shared TypeScript configuration for [XtraVisions](https://github.com/XtraVisionsAI) projects.

[![npm](https://img.shields.io/npm/v/@xv-shared/ts-config)](https://www.npmjs.com/package/@xv-shared/ts-config) [![license](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Install

```bash
pnpm add -D @xv-shared/ts-config
```

**Peer dependency:** `typescript >= 6`

## Configs

| Config | Use case |
| --- | --- |
| `@xv-shared/ts-config/base` | Shared base — strict mode, ESNext target, bundler module resolution |
| `@xv-shared/ts-config/dev` | Frontend development — extends base with `composite`, `jsx: "preserve"`, relaxed `noImplicitAny` |
| `@xv-shared/ts-config/node` | Node.js scripts / tooling — extends base with `sourceMap`, strict `noImplicitAny`, no emit |

## Usage

```json
// tsconfig.json (frontend project)
{
  "extends": "@xv-shared/ts-config/dev"
}
```

```json
// tsconfig.json (Node.js tooling)
{
  "extends": "@xv-shared/ts-config/node"
}
```

### Base config highlights

- `target`: ESNext
- `module`: ESNext
- `moduleResolution`: Bundler
- `strict`: true
- `isolatedModules`: true
- `resolveJsonModule`: true
- `experimentalDecorators`: true
- `skipLibCheck`: true

## License

[MIT](../../LICENSE) &copy; XtraVisions
