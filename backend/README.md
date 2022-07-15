# Vascue Starknet API

## Development

### Before you begin

- The build and running environment require

  - **node.js version 16**
  - **npm / yarn / pnpm** for package management

- Copy `.env.sample` to `.env` and replace the corresponding keys/secrets for development

### Installation

In the project directory, inside `functions` folder, run:

```
yarn install
```

### Normal Development Mode

In the project directory, inside `functions` folder, run:

```
yarn serve
```

### Watch Mode

In the project directory, inside `functions` folder, run:

```
yarn dev
```

API Link: http://localhost:5001/vascue-starknet/europe-west3/vascueStarknetApi/api

Emulator UI: http://localhost:4000/functions

### Production Build

In the project directory, inside `functions` folder, run:

```
yarn build
```

### Deployment

In the project directory, inside `functions` folder, run:

```
yarn deploy
```
