import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, Loader2, Crown, RefreshCcw, AlertCircle } from 'lucide-react';
import { usersService } from '../../services';

type PremiumStatus = 'loading' | 'success' | 'pending' | 'error';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<PremiumStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    const checkPremiumStatus = async () => {
      try {
        const account = await usersService.me();
        if (cancelled) return;

        if (Boolean(account.is_premium)) {
          setStatus('success');
          return;
        }

        // Webhook propagation can be slightly delayed after Stripe redirect.
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        if (cancelled) return;

        const retryAccount = await usersService.me();
        if (cancelled) return;

        setStatus(Boolean(retryAccount.is_premium) ? 'success' : 'pending');
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
      }
    };

    checkPremiumStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-4 pb-6 pt-3 max-w-[980px]">
      <h1 className="text-[13px] font-semibold text-foreground mb-0.5">Resultado del pago</h1>
      <p className="text-[11px] text-muted-foreground mb-4">Validando el estado de tu suscripcion premium</p>

      <div className="bg-card border border-border rounded-[6px] p-5">
        {status === 'loading' && (
          <div className="flex items-start gap-3">
            <Loader2 className="w-5 h-5 mt-0.5 text-primary animate-spin" />
            <div>
              <p className="text-[13px] font-medium text-foreground">Confirmando tu acceso premium...</p>
              <p className="text-[11px] text-muted-foreground mt-1">Esto puede tomar unos segundos mientras se procesa el webhook.</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-success" />
            <div className="w-full">
              <p className="text-[13px] font-medium text-foreground">Pago confirmado. Premium activo.</p>
              <p className="text-[11px] text-muted-foreground mt-1">Tu cuenta ya tiene habilitadas las funcionalidades premium.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/profile"
                  className="h-8 px-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-[4px] text-[11px] font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  Ir a mi perfil
                </Link>
                <Link
                  to="/dashboard"
                  className="h-8 px-3 border border-border hover:bg-accent rounded-[4px] text-[11px] font-medium transition-colors inline-flex items-center"
                >
                  Ir al dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="flex items-start gap-3">
            <RefreshCcw className="w-5 h-5 mt-0.5 text-warning" />
            <div className="w-full">
              <p className="text-[13px] font-medium text-foreground">Pago recibido, esperando confirmacion final.</p>
              <p className="text-[11px] text-muted-foreground mt-1">Aun no vemos `is_premium=true`. Recarga esta pagina en unos segundos o revisa tu perfil.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/profile"
                  className="h-8 px-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-[4px] text-[11px] font-medium transition-colors"
                >
                  Revisar perfil
                </Link>
                <Link
                  to="/dashboard"
                  className="h-8 px-3 border border-border hover:bg-accent rounded-[4px] text-[11px] font-medium transition-colors inline-flex items-center"
                >
                  Continuar
                </Link>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-destructive" />
            <div className="w-full">
              <p className="text-[13px] font-medium text-foreground">No pudimos validar tu estado premium.</p>
              <p className="text-[11px] text-muted-foreground mt-1">Intenta nuevamente desde tu perfil o recarga esta pagina.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/profile"
                  className="h-8 px-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-[4px] text-[11px] font-medium transition-colors"
                >
                  Ir a perfil
                </Link>
                <Link
                  to="/dashboard"
                  className="h-8 px-3 border border-border hover:bg-accent rounded-[4px] text-[11px] font-medium transition-colors inline-flex items-center"
                >
                  Volver al dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}