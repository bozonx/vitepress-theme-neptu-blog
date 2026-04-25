/// <reference types="vite/client" />

declare module '@midzer/tobii' {
  const Tobii: any;
  export default Tobii;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*/loadPosts.data' {
  export const data: any
}

declare module '*/loadPosts.data.js' {
  export const data: any
}

declare module '*/loadPosts.data.ts' {
  export const data: any
}
