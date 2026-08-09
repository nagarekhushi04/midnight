import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-obsidian)',
          color: 'var(--text-sand)',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent-terracotta)', fontSize: '2rem', marginBottom: '16px' }}>
              Oops! Something went wrong.
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              We encountered an unexpected error while rendering the application. This is often caused by missing wallet extensions or unexpected network states.
            </p>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#FCA5A5',
              wordBreak: 'break-all',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              {this.state.error?.message || 'Unknown Error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--accent-rose-light)',
                color: 'var(--bg-obsidian)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
