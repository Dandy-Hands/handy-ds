// Animate (docs/component-specs/animate/spec.md). No Base UI primitive (@base-ui/react 1.8.0 has none for motion).
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import './base.css';
import './Animate.css';

export type AnimateEffect = 'fade' | 'fade-up' | 'scale';
export type AnimateTrigger = 'view' | 'mount';

export interface AnimateProps {
  effect?: AnimateEffect;
  trigger?: AnimateTrigger;
  /** Children that start together start one after another. */
  stagger?: boolean;
  children?: ReactNode;
}

const MAX_STAGGER = 8;

/** Page building category. One-time entrance animation on each element child. `display: contents`, so it adds no box. */
export function Animate({ effect = 'fade-up', trigger = 'view', stagger = false, children }: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  // `view`: the script hides only children out of view, so content stays visible without it.
  useLayoutEffect(() => {
    const root = ref.current;
    if (trigger !== 'view' || !root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      let i = 0;
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        io.unobserve(target);
        (target as HTMLElement).style.setProperty('--_i', String(stagger ? Math.min(i++, MAX_STAGGER) : 0));
        target.removeAttribute('data-pending');
        target.setAttribute('data-visible', '');
      }
    }, { threshold: 0.1 });
    const watch = (el: Element) => {
      el.setAttribute('data-pending', '');
      io.observe(el);
    };
    for (const el of root.children) {
      const r = el.getBoundingClientRect();
      // Already in view at mount: show at once, so a server-rendered page does not flash.
      if (r.top < window.innerHeight && r.bottom > 0) continue;
      watch(el);
    }
    const mo = new MutationObserver((records) => {
      for (const { addedNodes } of records) addedNodes.forEach((n) => n instanceof Element && watch(n));
    });
    mo.observe(root, { childList: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      for (const el of root.children) el.removeAttribute('data-pending');
    };
  }, [trigger, stagger]);

  return (
    <div ref={ref} className="hds-animate" data-effect={effect} data-trigger={trigger} data-stagger={stagger || undefined}>
      {children}
    </div>
  );
}
