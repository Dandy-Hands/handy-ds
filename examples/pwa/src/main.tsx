import { StrictMode, useEffect, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Alert, Button, Card, Checkbox, Field, Form, Icon, Progress, Text, Toast, Toaster, Toggle, ToggleGroup,
} from 'handy-ds';
import 'handy-ds/styles.css';
import './theme.css';
import './app.css';

interface Task {
  id: string;
  title: string;
  done: boolean;
}

// Tasks live in localStorage, so the app works fully offline once the service worker has it.
function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem('tasks') ?? '[]');
  } catch {
    return [];
  }
}

const subscribeOnline = (cb: () => void) => {
  addEventListener('online', cb);
  addEventListener('offline', cb);
  return () => {
    removeEventListener('online', cb);
    removeEventListener('offline', cb);
  };
};

const Trash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine);
  const toast = Toast.useToastManager();

  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks([...tasks, { id: crypto.randomUUID(), title: title.trim(), done: false }]);
    setTitle('');
    toast.add({ title: 'Task added', type: 'success' });
  };
  const update = (id: string, patch: Partial<Task>) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const done = tasks.filter((t) => t.done).length;
  const shown = tasks.filter((t) => filter === 'all' || (filter === 'done') === t.done);

  return (
    <div className="app">
      <header data-section="hero" className="top">
        <Text variant="heading" render={<h1 />}>Tasks</Text>
        <Text variant="caption">{online ? 'Online' : 'Offline: changes are saved on this device'}</Text>
      </header>

      {!online && (
        <Alert sentiment="warning" role="status" heading="You're offline">
          Everything still works. Tasks are stored on this device.
        </Alert>
      )}

      <Card className="panel">
        <Form onSubmit={add} className="add">
          <Field.Root>
            <Field.Label>New task</Field.Label>
            <Field.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Buy oat milk" />
          </Field.Root>
          <Button type="submit">Add</Button>
        </Form>

        <Progress.Root value={tasks.length ? Math.round((done / tasks.length) * 100) : 0}>
          <Progress.Label>{done} of {tasks.length} done</Progress.Label>
          <Progress.Value />
          <Progress.Track><Progress.Indicator /></Progress.Track>
        </Progress.Root>

        <ToggleGroup value={[filter]} onValueChange={(v) => v[0] && setFilter(String(v[0]))} aria-label="Filter">
          <Toggle value="all">All</Toggle>
          <Toggle value="active">Active</Toggle>
          <Toggle value="done">Done</Toggle>
        </ToggleGroup>

        <ul className="tasks">
          {shown.map((task) => (
            <li key={task.id}>
              <Field.Root>
                <Field.Label>
                  <Checkbox.Root checked={task.done} onCheckedChange={(checked) => update(task.id, { done: checked })}>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  {task.title}
                </Field.Label>
              </Field.Root>
              <Button priority="tertiary" aria-label={`Delete ${task.title}`} onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}>
                <Icon><Trash /></Icon>
              </Button>
            </li>
          ))}
        </ul>
        {shown.length === 0 && <Text variant="caption">Nothing here yet.</Text>}
      </Card>
      <Toaster />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast.Provider>
      <App />
    </Toast.Provider>
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
