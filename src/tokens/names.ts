// Token name grammar and the full semantic token list (token-system-spec.md sections 2 and 7).
// Validates slash-form names (hds/sem/color/action/primary/hover/bg), not emitted CSS
// custom properties: those can't be parsed back because property names contain hyphens.

export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export const SLOT_COUNT = 11;
export const SYSTEM_ROLES = ['danger', 'warning', 'success', 'info'] as const;
export const ROLES = ['primary', 'secondary', ...SYSTEM_ROLES] as const;

export const PRIORITY = ['primary', 'secondary', 'tertiary', 'danger'] as const;
export const ACTION_STATE = ['default', 'hover', 'active', 'disabled', 'selected'] as const;
export const ACTION_PROP = ['bg', 'fg', 'border'] as const;
export const FIELD_STATE = ['default', 'hover', 'focus', 'error', 'disabled', 'checked'] as const;
export const FIELD_PROP = ['bg', 'fg', 'border', 'placeholder'] as const;
export const LEVEL = ['sunken', 'base', 'raised', 'floating', 'modal'] as const;
export const CONTENT_ROLE = ['strong', 'default', 'muted', 'accent', 'link'] as const;
export const SENTIMENT = SYSTEM_ROLES;
export const FEEDBACK_PROP = ['bg', 'fg', 'border', 'icon'] as const;
// Media scrim (Section `scrim`): a tone-colored layer over an image or video. `tone` is the scrim color, so a dark tone puts light text on a dark layer.
export const MEDIA_TONE = ['dark', 'light'] as const;
export const MEDIA_STRENGTH = ['subtle', 'medium', 'strong'] as const;
export const CATEGORICAL = 8;
export const SEQUENTIAL = 9;
export const DIVERGING = 9;

export const SPACE = ['050', '100', '200', '300', '400', '600', '800', '1000', '1200', '1600', '2400'] as const;
// Component widths (Tiles, Grid, Aside). Page widths are drivers: `measure/width/content` and `content-narrow`.
export const WIDTH = ['6400', '8000', '9600', '12800'] as const;
export const WIDTH_PAGE = ['content', 'content-narrow'] as const;
export const SIZE = ['200', '300', '400', '500', '600', '800', '1000', '1200', '1600', '2400', '3200'] as const;
export const SHAPE_ROLE = ['control', 'container', 'indicator', 'round'] as const;
export const BORDER_ROLE = ['control', 'container', 'divider', 'focus'] as const;
export const ELEVATION = ['raised', 'floating', 'modal'] as const;
export const TEXT_ROLE = ['display', 'headline', 'body', 'label', 'caption'] as const;
export const TEXT_SIZE = ['sm', 'md', 'lg'] as const;
export const TEXT_PROP = ['family', 'weight', 'leading', 'tracking'] as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => String(i + 1));
const cross = (prefix: string, ...lists: readonly (readonly string[])[]): string[] =>
  lists.reduce<string[]>((acc, list) => acc.flatMap((a) => list.map((s) => `${a}/${s}`)), [prefix]);

/** Every color token, without the `hds/sem/color/` prefix (spec 7.2, 152 names). */
export const COLOR_TOKENS: string[] = [
  ...cross('action', PRIORITY, ACTION_STATE, ACTION_PROP),
  ...cross('field', FIELD_STATE, FIELD_PROP),
  ...cross('surface', LEVEL, ['bg', 'border']),
  ...cross('content', CONTENT_ROLE, ['fg']),
  'content/link/hover/fg',
  ...cross('graphic/divider', ['default', 'strong']),
  ...cross('graphic/categorical', range(CATEGORICAL)),
  ...cross('graphic/sequential', range(SEQUENTIAL)),
  ...cross('graphic/diverging', range(DIVERGING)),
  ...cross('feedback', SENTIMENT, FEEDBACK_PROP),
  'focus/ring',
  'overlay/scrim',
  ...cross('overlay/media', MEDIA_TONE, MEDIA_STRENGTH),
];

/** Every semantic token in slash form (spec 7.8, 226 names). */
export const SEM_TOKENS: string[] = [
  ...COLOR_TOKENS.map((n) => `color/${n}`),
  ...cross('measure/space', SPACE),
  ...cross('measure/size', SIZE),
  ...cross('measure/width', WIDTH),
  ...cross('measure/width', WIDTH_PAGE),
  ...cross('radius', SHAPE_ROLE),
  ...cross('border', BORDER_ROLE),
  ...cross('elevation', ELEVATION),
  ...cross('typography', TEXT_ROLE, TEXT_PROP),
  ...cross('typography', TEXT_ROLE, ['size'], TEXT_SIZE),
].map((n) => `hds/sem/${n}`);

// Segment trie of SEM_TOKENS, for error messages that name the first bad segment.
type Trie = Map<string, Trie>;
const trie: Trie = new Map();
for (const name of SEM_TOKENS) {
  let node = trie;
  for (const seg of name.split('/').slice(2)) {
    if (!node.has(seg)) node.set(seg, new Map());
    node = node.get(seg)!;
  }
}

// Shape check only. The full primitive list is whatever resolvePrimitives() emits;
// tokens.test.ts asserts every emitted name passes this and never depends on driver values.
const PRIM_TYPES = ['color', 'dimension', 'width', 'radius', 'border', 'shadow', 'typography'];
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Returns an error message, or null when the name is valid. */
export function checkTokenName(name: string): string | null {
  const [ns, layer, ...rest] = name.split('/');
  if (ns !== 'hds') return 'namespace must be "hds"';

  if (layer === 'prim') {
    const [type, ...property] = rest;
    if (!PRIM_TYPES.includes(type)) return `unknown primitive type "${type}"`;
    if (property.length === 0) return 'missing primitive property';
    const bad = property.find((s) => !SEGMENT.test(s));
    return bad === undefined ? null : `bad segment "${bad}"`;
  }

  if (layer === 'sem') {
    let node = trie;
    for (const seg of rest) {
      const next = node.get(seg);
      if (!next) {
        return node.size === 0 ? `extra segment "${seg}"` : `"${seg}" not allowed here (expected ${[...node.keys()].join('|')})`;
      }
      node = next;
    }
    return node.size === 0 ? null : `incomplete name (next: ${[...node.keys()].join('|')})`;
  }

  return 'layer must be "prim" or "sem"';
}
