import { Button, Toast, Toaster } from 'handy-ds';

function ToastDemo() {
  const toast = Toast.useToastManager();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['info', 'success', 'warning', 'danger'] as const).map((type) => (
        <Button key={type} priority="secondary" onClick={() => toast.add({ type, title: `${type} toast`, description: 'Something happened.' })}>
          {type}
        </Button>
      ))}
    </div>
  );
}
