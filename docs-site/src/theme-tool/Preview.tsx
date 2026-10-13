// Preview pane (theme-customization-spec.md section 4, interview K1): a component sheet and
// sample pages, themed by the theme under edit. It sits outside `.hds-chrome`, so it reads
// the `:root` theme, and so do the popups that Base UI portals to <body>.
import { useState } from 'react';
import {
  Alert, Button, Card, Checkbox, Field, Fieldset, Form, Input, Meter, Radio, RadioGroup, Separator, Switch, Table, Text,
  Toast, Toaster,
} from 'handy-ds';
import { ShowcaseBody } from '../Showcase.tsx';

const TABS = ['Components', 'Marketing', 'Form', 'Dashboard', 'Contexts'] as const;
type Tab = (typeof TABS)[number];

export function PreviewTabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="tt-steps" role="tablist" aria-label="Preview content">
      {TABS.map((t) => (
        <button key={t} type="button" role="tab" aria-selected={tab === t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>
      ))}
    </div>
  );
}

export function usePreviewTab() {
  return useState<Tab>('Components');
}

export function Preview({ tab }: { tab: Tab }) {
  return (
    <Toast.Provider>
      <div className="showcase tt-preview-body">
        {tab === 'Components' && <ShowcaseBody />}
        {tab === 'Marketing' && <Marketing />}
        {tab === 'Form' && <FormPage />}
        {tab === 'Dashboard' && <Dashboard />}
        {tab === 'Contexts' && <Contexts />}
        <Toaster />
      </div>
    </Toast.Provider>
  );
}

function Marketing() {
  return (
    <>
      <section data-section="hero" className="hero">
        <Text variant="caption">New in 2026</Text>
        <Text variant="display" render={<h1 />}>Ship client sites in days</Text>
        <Text>One component library, re-themed per client. The hero uses <code>data-section="hero"</code>.</Text>
        <div className="row"><Button>Start a project</Button><Button variant="secondary">See the work</Button></div>
      </section>
      <main className="grid">
        {['Fast', 'Accessible', 'Themeable'].map((t) => (
          <Card key={t}>
            <Text variant="headline" render={<h2 />}>{t}</Text>
            <Text>Short supporting copy for the {t.toLowerCase()} feature. <a href="#">Learn more</a></Text>
            <Button variant="tertiary">Details</Button>
          </Card>
        ))}
      </main>
      <footer data-section="footer" className="hero">
        <Text variant="label">Footer</Text>
        <Text variant="caption">Map a "footer" section in step 3 to theme this band.</Text>
      </footer>
    </>
  );
}

function FormPage() {
  return (
    <main className="grid">
      <Card className="wide">
        <Text variant="headline" render={<h1 />}>Request a quote</Text>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Field.Root><Field.Label>Company</Field.Label><Field.Control placeholder="Acme Inc." /></Field.Root>
          <Field.Root invalid><Field.Label>Email</Field.Label><Field.Control defaultValue="jane@" /><Field.Error match>Enter a valid email.</Field.Error></Field.Root>
          <Field.Root>
            <Fieldset.Root render={<RadioGroup defaultValue="web" />}>
              <Fieldset.Legend>Project type</Fieldset.Legend>
              <Field.Item><Field.Label><Radio.Root value="web"><Radio.Indicator /></Radio.Root>Website</Field.Label></Field.Item>
              <Field.Item><Field.Label><Radio.Root value="app"><Radio.Indicator /></Radio.Root>Web app</Field.Label></Field.Item>
            </Fieldset.Root>
          </Field.Root>
          <Field.Root><Field.Label><Checkbox.Root defaultChecked><Checkbox.Indicator /></Checkbox.Root>Send me updates</Field.Label></Field.Root>
          <Field.Root><Field.Label><Switch.Root><Switch.Thumb /></Switch.Root>Rush delivery</Field.Label></Field.Root>
          <Input disabled placeholder="Budget (set after review)" />
          <div className="row"><Button type="submit">Send request</Button><Button variant="tertiary">Cancel</Button></div>
        </Form>
      </Card>
    </main>
  );
}

function Dashboard() {
  const bars = [40, 65, 52, 80, 72, 90, 58];
  return (
    <main className="grid">
      <Alert sentiment="warning" heading="Billing">Your trial ends in 3 days.</Alert>
      <Card>
        <Text variant="label">Revenue</Text>
        <Text variant="display">$48.2k</Text>
        <Meter.Root value={72} tone="success"><Meter.Label>Goal</Meter.Label><Meter.Value /><Meter.Track><Meter.Indicator /></Meter.Track></Meter.Root>
      </Card>
      <Card>
        <Text variant="label">Visits by day</Text>
        <svg viewBox="0 0 140 60" role="img" aria-label="Visits chart" style={{ width: '100%' }}>
          {bars.map((b, i) => (
            <rect key={i} x={4 + i * 19} y={58 - b * 0.6} width={14} height={b * 0.6} fill={`var(--hds-sem-color-graphic-categorical-${(i % 8) + 1})`} />
          ))}
        </svg>
      </Card>
      <Card className="wide">
        <Text variant="headline" render={<h2 />}>Recent orders</Text>
        <Table striped>
          <thead><tr><th>Order</th><th>Client</th><th>Status</th></tr></thead>
          <tbody>
            {[['#1042', 'Acme', 'Paid'], ['#1041', 'Globex', 'Pending'], ['#1040', 'Initech', 'Refunded']].map((r) => (
              <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>
            ))}
          </tbody>
        </Table>
        <Separator />
        <div className="row"><Button size="800">Export</Button><Button size="800" variant="secondary">Filter</Button><Button size="800" variant="danger">Delete</Button></div>
      </Card>
    </main>
  );
}

/** Root, on-primary, and on-secondary side by side (spec section 4). */
function Contexts() {
  return (
    <div className="tt-contexts">
      {(['default', 'on-primary', 'on-secondary'] as const).map((c) => (
        <section key={c} data-context={c} className="tt-context">
          <Text variant="label">{c === 'default' ? 'root' : c}</Text>
          <Text variant="headline" render={<h2 />}>Heading</Text>
          <Text>Body text with a <a href="#">link</a>.</Text>
          <Text variant="caption">Muted caption</Text>
          <div className="row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="tertiary">Tertiary</Button></div>
          <Input placeholder="Field" />
          <Card><Text>A card inside the section.</Text></Card>
        </section>
      ))}
    </div>
  );
}
