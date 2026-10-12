// Base UI @base-ui/react 1.8.0 — wraps @base-ui/react/avatar.
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ReactElement, ReactNode } from 'react';
import './base.css';
import './Avatar.css';

/** Width and height: measure/size/{size}. */
export type AvatarSize = '800' | '1000' | '1200' | '1600';

/** Minimal by spec, as Meter: no className, style, ref, or other native props on any part. */
export interface AvatarRootProps {
  size?: AvatarSize;
  children?: ReactNode;
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  keepMounted?: boolean;
  onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void;
  /** An optimized image component such as `next/image`. Set `keepMounted` with it. */
  render?: ReactElement;
}

export interface AvatarFallbackProps {
  /** Milliseconds before the fallback shows. */
  delay?: number;
  children?: ReactNode;
}

function AvatarRoot({ size = '1000', children }: AvatarRootProps) {
  return <BaseAvatar.Root data-size={size} className="hds-avatar">{children}</BaseAvatar.Root>;
}

function AvatarImage(props: AvatarImageProps) {
  return <BaseAvatar.Image {...props} className="hds-avatar__image" />;
}

function AvatarFallback(props: AvatarFallbackProps) {
  return <BaseAvatar.Fallback {...props} className="hds-avatar__fallback" />;
}

/** A person's photo in a round frame, with initials or an icon as fallback. */
export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
