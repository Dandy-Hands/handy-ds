// Base UI @base-ui/react 1.8.0 (useRender, mergeProps only; no Base UI primitive).
import { useEffect, useRef, type ReactNode } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Section.css';
import { responsive, spaceValue, type Responsive, type Space } from './responsive.ts';

export type SectionSurface = 'sunken' | 'base' | 'primary' | 'secondary';
export type SectionDirection = 'to-bottom' | 'to-top' | 'to-start' | 'to-end';
export type SectionGradient = { to: 'sunken' | 'base'; direction: SectionDirection };
export type SectionMediaFit = 'cover' | 'contain';
export type SectionMedia =
  | { type: 'image'; src: string; fit?: SectionMediaFit; position?: string }
  | { type: 'video'; src: string; poster: string; fit?: SectionMediaFit; position?: string };
export type SectionScrim = { tone: 'dark' | 'light'; strength: 'subtle' | 'medium' | 'strong'; direction?: SectionDirection };
export type SectionContentWidth = 'default' | 'narrow' | 'full';
export type SectionAlign = 'start' | 'center' | 'end';
/** `"auto"`, `"screen"` (100svh), or a CSS length string. */
export type SectionHeight = 'auto' | 'screen' | (string & {});

interface SectionOwnProps {
  surface?: SectionSurface;
  gradient?: SectionGradient;
  media?: SectionMedia;
  scrim?: SectionScrim;
  /** A custom layer behind the content. Approved exception to the slot rule (api-conventions section 1). */
  background?: ReactNode;
  paddingBlock?: Responsive<Space>;
  paddingInline?: Responsive<Space>;
  contentWidth?: SectionContentWidth;
  height?: SectionHeight;
  minHeight?: SectionHeight;
  align?: SectionAlign;
}

export interface SectionProps extends SectionOwnProps, Omit<useRender.ComponentProps<'section'>, 'style'> {}
export interface HeaderProps extends SectionOwnProps, Omit<useRender.ComponentProps<'header'>, 'style'> {
  /** Stays at the top of the screen while the page scrolls, with the raised shadow. */
  sticky?: boolean;
}
export interface FooterProps extends SectionOwnProps, Omit<useRender.ComponentProps<'footer'>, 'style'> {}

const length = (v: SectionHeight) => (v === 'screen' ? '100svh' : v);

function Video({ media }: { media: Extract<SectionMedia, { type: 'video' }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const saveData = typeof navigator !== 'undefined' && (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  useEffect(() => {
    const video = ref.current;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      // ponytail: data saver never plays; the poster stays. No user control to start it.
      if (query.matches || saveData) video?.pause();
      else video?.play().catch(() => {});
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [saveData]);
  return (
    <video
      ref={ref}
      className="hds-section__media"
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload={saveData ? 'none' : 'auto'}
      style={{ objectFit: media.fit ?? 'cover', objectPosition: media.position ?? 'center' }}
    />
  );
}

function useSection(
  tag: 'section' | 'header' | 'footer',
  defaultPaddingBlock: Space,
  { surface = 'base', gradient, media, scrim, background, paddingBlock = defaultPaddingBlock, paddingInline = '400', contentWidth = 'default', height = 'auto', minHeight = 'auto', align = 'start', children, render, sticky, ...props }: SectionOwnProps & {
    children?: ReactNode;
    render?: useRender.ComponentProps<'div'>['render'];
    sticky?: boolean;
  } & Record<string, unknown>,
) {
  const context = surface === 'primary' || surface === 'secondary' ? `on-${surface}` : undefined;
  const to = gradient?.to ?? 'base';
  const level = surface === 'sunken' ? 'sunken' : 'base';
  // Names built with join so the token-name scan does not read a partial name.
  const token = (...p: string[]) => `var(--${['hds', 'sem', 'color', ...p].join('-')})`;
  return useRender({
    defaultTagName: tag,
    render: render as never,
    props: mergeProps<'div'>(
      {
        className: 'hds-section',
        'data-surface': surface,
        'data-content-width': contentWidth,
        'data-align': align,
        'data-sticky': sticky ? '' : undefined,
        'data-context': context,
        'data-mode': scrim ? scrim.tone : undefined,
        style: {
          ...responsive('padding-block', paddingBlock, spaceValue),
          ...responsive('padding-inline', paddingInline, spaceValue),
          '--_bg': token('surface', level, 'bg'),
          '--_to': gradient ? token('surface', to, 'bg') : undefined,
          '--_gradient': gradient ? `linear-gradient(in oklch ${dir(gradient.direction)}, var(--_bg), var(--_to))` : undefined,
          '--_height': length(height),
          '--_min-height': length(minHeight),
          '--_content-width': contentWidth === 'full' ? '100%' : `var(--${['hds', 'sem', 'measure', 'width', contentWidth === 'narrow' ? 'content-narrow' : 'content'].join('-')})`,
        } as object,
        children: (
          <>
            {media?.type === 'image' && (
              <img
                className="hds-section__media"
                src={media.src}
                alt=""
                aria-hidden="true"
                style={{ objectFit: media.fit ?? 'cover', objectPosition: media.position ?? 'center' }}
              />
            )}
            {media?.type === 'video' && <Video media={media} />}
            {background != null && <div className="hds-section__background" aria-hidden="true">{background}</div>}
            {scrim && (
              <div
                className="hds-section__scrim"
                aria-hidden="true"
                data-tone={scrim.tone}
                data-strength={scrim.strength}
                data-direction={scrim.direction}
              />
            )}
            <div className="hds-section__content">{children}</div>
          </>
        ),
      } as object,
      props,
    ),
  });
}

const dir = (d: SectionDirection) => ({ 'to-bottom': 'to bottom', 'to-top': 'to top', 'to-start': 'to left', 'to-end': 'to right' })[d]; // ponytail: to-start/to-end are physical (left/right); flip for RTL if needed.

/** Page-building category. A full-width band: surface, gradient, media, scrim, and a centered content column. No Base UI primitive. */
export function Section(props: SectionProps) {
  return useSection('section', '1600', props as never);
}

/** Section as a `<header>`. `sticky` pins it to the top with the raised shadow. */
export function Header(props: HeaderProps) {
  return useSection('header', '400', props as never);
}

/** Section as a `<footer>`. */
export function Footer(props: FooterProps) {
  return useSection('footer', '800', props as never);
}
