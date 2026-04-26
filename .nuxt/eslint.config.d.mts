import type { FlatConfigComposer } from "../node_modules/.pnpm/eslint-flat-config-utils@2.1.4/node_modules/eslint-flat-config-utils/dist/index.mjs"
import { defineFlatConfigs } from "../node_modules/.pnpm/@nuxt+eslint-config@1.12.1_@typescript-eslint+utils@8.57.0_eslint@9.39.4_jiti@2.6.1__ty_5d8a3d84efeff985737e6a2baf6e2374/node_modules/@nuxt/eslint-config/dist/flat.mjs"
import type { NuxtESLintConfigOptionsResolved } from "../node_modules/.pnpm/@nuxt+eslint-config@1.12.1_@typescript-eslint+utils@8.57.0_eslint@9.39.4_jiti@2.6.1__ty_5d8a3d84efeff985737e6a2baf6e2374/node_modules/@nuxt/eslint-config/dist/flat.mjs"

declare const configs: FlatConfigComposer
declare const options: NuxtESLintConfigOptionsResolved
declare const withNuxt: typeof defineFlatConfigs
export default withNuxt
export { withNuxt, defineFlatConfigs, configs, options }