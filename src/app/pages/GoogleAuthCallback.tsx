import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { tokenStore } from '../../services';

type CallbackState = 'loading' | 'success' | 'error';

function readToken(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function GoogleAuthCallback() {
  const [state, setState] = useState<CallbackState>('loading');
  const [message, setMessage] = useState('Procesando inicio de sesión con Google...');

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => {
    const accessToken = readToken(searchParams.get('access_token'));
    const refreshToken = readToken(searchParams.get('refresh_token'));

    if (!accessToken || !refreshToken) {
      setState('error');
      setMessage('La respuesta de Google no incluyó los tokens esperados.');
      return;
    }

    tokenStore.set(accessToken, refreshToken);
    setState('success');
    setMessage('Sesión lista. Redirigiendo al dashboard...');

    const redirectId = window.setTimeout(() => {
      window.location.replace('/dashboard');
    }, 500);

    return () => window.clearTimeout(redirectId);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[10px] border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {state === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
          {state === 'success' && <CheckCircle2 className="h-5 w-5" />}
          {state === 'error' && <AlertCircle className="h-5 w-5" />}
        </div>

        <h1 className="text-[18px] font-semibold text-foreground">Inicio de sesión con Google</h1>
        <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{message}</p>

        {state === 'error' && (
          <div className="mt-5 flex items-center gap-2">
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-[4px] bg-primary px-4 text-[12px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Volver al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}