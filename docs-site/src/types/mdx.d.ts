declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<Record<string, never>>;
  export const frontmatter: Record<string, unknown> | undefined;
  export default Component;
}
