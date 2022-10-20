import { type ViteSSGContext } from 'vite-ssg'

export type UserPlugin = (ctx: ViteSSGContext) => void
