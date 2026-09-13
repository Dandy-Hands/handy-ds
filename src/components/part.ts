import { createElement, type ComponentType } from 'react';

type ClassName<S> = string | ((state: S) => string | undefined) | undefined;

/** Prepends the hds class. Keeps Base UI's function form (`className={(state) => ...}`) working. */
export function cx<S>(base: string, extra: ClassName<S>): string | ((state: S) => string) {
  if (typeof extra === 'function') return (state: S) => `${base} ${extra(state) ?? ''}`.trim();
  return extra ? `${base} ${extra}` : base;
}

/**
 * Wraps a Base UI part so it always carries its hds class (and optional default props,
 * e.g. `data-priority`). Every other prop, and `ref`, passes straight through, so the
 * Base UI docs for that part apply unchanged.
 */
/* @__NO_SIDE_EFFECTS__ */ // lets bundlers drop unused compound components (tree-shaking)
export function part<C extends ComponentType<any>>(Part: C, className: string, defaults: Record<string, unknown> = {}): C {
  const Styled = (props: { className?: ClassName<unknown> }) =>
    createElement(Part, { ...defaults, ...props, className: cx(className, props.className) });
  Styled.displayName = className;
  return Styled as unknown as C;
}
