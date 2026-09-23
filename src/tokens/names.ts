// Token name grammar from token-system-spec.md sections 2, 6 and 7.
// Validates slash-form names (hds/sem/action/color/primary/hover/bg), not emitted CSS
// custom properties: those can't be parsed back because property names contain hyphens.

export const PRIORITY = ['primary', 'secondary', 'tertiary'];
export const ACTION_STATE = ['default', 'hover', 'active', 'focus', 'disabled', 'selected'];
export const INPUT_STATE = ['default', 'hover', 'focus', 'error', 'disabled', 'checked'];
export const SIZE = ['sm', 'md', 'lg'];
export const ELEVATION = ['0', '1', '2', '3'];
export const SURFACE_STATE = ['default', 'striped'];
export const TYPE_ROLE = ['display', 'heading', 'body', 'label', 'caption'];
export const TYPE_SIZE = ['1', '2', '3']; // per-role size steps: 1 = smallest, 2 = role default, 3 = largest
export const ICON_ROLE = ['default', 'secondary', 'accent'];
export const WEIGHT = ['thin', 'medium', 'thick'];
export const SENTIMENT = ['danger', 'warning', 'success', 'info'];

// Section 7 templates: category -> type -> ordered segment slots; the last slot is the property.
// Section 6 falls out of this table: the `other` type exists only under `type`.
const SEM: Record<string, Record<string, string[][]>> = {
  action: {
    color: [PRIORITY, ACTION_STATE, ['bg', 'fg', 'border']],
    measure: [SIZE, ['padding-x', 'padding-y', 'radius', 'gap', 'border-width']],
  },
  input: {
    color: [INPUT_STATE, ['bg', 'fg', 'border', 'placeholder-fg']],
    measure: [SIZE, ['padding-x', 'padding-y', 'height', 'radius', 'border-width']],
  },
  surface: {
    color: [ELEVATION, SURFACE_STATE, ['bg', 'border', 'shadow']],
    measure: [['padding', 'radius', 'border-width']],
  },
  type: {
    color: [TYPE_ROLE, ['fg']],
    measure: [TYPE_ROLE, ['size', 'line-height', 'letter-spacing']],
    other: [TYPE_ROLE, ['font-family', 'weight']],
  },
  icon: {
    color: [ICON_ROLE, ['fg']],
  },
  divider: {
    color: [['border']],
    measure: [WEIGHT, ['thickness']],
  },
  feedback: {
    color: [SENTIMENT, ['bg', 'fg', 'border', 'icon-fg']],
    measure: [['padding', 'radius', 'gap', 'border-width']],
  },
  overlay: {
    color: [['bg']],
  },
  focus: {
    color: [['stroke']],
    measure: [['stroke-width']],
  },
};

// Segment slot lists are exact; a category/type listed in OPTIONAL_SEGMENT also accepts
// one extra middle segment from that set. Currently only Type's size steps (spec gap).
const OPTIONAL_SEGMENT: Record<string, readonly string[]> = { 'type/measure': TYPE_SIZE };

// Shape check only. The full primitive list is whatever resolvePrimitives() emits;
// tokens.test.ts asserts every emitted name passes this and never depends on driver values.
const PRIM_TYPES = ['color', 'space', 'radius', 'border', 'type', 'shadow'];
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
    const [category, type, ...segments] = rest;
    if (!Object.hasOwn(SEM, category)) return `unknown category "${category}"`;
    if (!Object.hasOwn(SEM[category], type)) return `category "${category}" has no type "${type}"`;
    const slots = SEM[category][type];
    const optional = OPTIONAL_SEGMENT[`${category}/${type}`];
    const extra = segments.length - slots.length;
    if (extra === 0) {
      const i = segments.findIndex((s, i) => !slots[i].includes(s));
      return i === -1 ? null : `"${segments[i]}" not allowed here (expected ${slots[i].join('|')})`;
    }
    if (extra === 1 && optional) {
      if (!slots[0].includes(segments[0])) {
        return `"${segments[0]}" not allowed here (expected ${slots[0].join('|')})`;
      }
      if (!optional.includes(segments[1])) {
        return `"${segments[1]}" not allowed here (expected ${optional.join('|')})`;
      }
      const last = slots.length - 1;
      return slots[last].includes(segments[2])
        ? null
        : `"${segments[2]}" not allowed here (expected ${slots[last].join('|')})`;
    }
    return `expected ${slots.length}${optional ? ` or ${slots.length + 1}` : ''} segment(s) after "${category}/${type}", got ${segments.length}`;
  }

  return 'layer must be "prim" or "sem"';
}
