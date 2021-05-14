# storybook-configuration

Set up storybook for a react library

## Usage

```bash
nx generate storybook-configuration ...
```

By default, Nx will search for `storybook-configuration` in the default collection provisioned in `angular.json`.

You can specify the collection explicitly as follows:

```bash
nx g @nrwl/react:storybook-configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g storybook-configuration ... --dry-run
```

## Options

### configureCypress

Default: `true`

Type: `boolean`

Run the cypress-configure generator.

### cypressDirectory

Type: `string`

A directory where the Cypress project will be placed. Placed at the root by default.

### generateCypressSpecs

Default: `true`

Type: `boolean`

Automatically generate \*.spec.ts files in the cypress e2e app generated by the cypress-configure generator

### generateStories

Default: `true`

Type: `boolean`

Automatically generate \*.stories.ts files for components declared in this project?

### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files.

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`

The tool to use for running lint checks.

### name

Type: `string`

Project name