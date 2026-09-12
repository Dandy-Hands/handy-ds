// Phase 0 exit check: a Base UI component imports and renders in isolation.
// Replace with the hds Button test in Phase 3.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Button } from '@base-ui/react/button';

test('Base UI Button renders', () => {
  const html = renderToString(createElement(Button, null, 'Hi'));
  assert.match(html, /<button[^>]*>Hi<\/button>/);
});
