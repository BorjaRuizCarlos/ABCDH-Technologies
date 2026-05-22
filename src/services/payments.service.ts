import { api } from './api';
import type { CreateCheckoutSessionResponse } from './types';

export type PremiumPlan = 'monthly' | 'annual';

export const paymentsService = {
  createCheckoutSession(plan: PremiumPlan): Promise<CreateCheckoutSessionResponse> {
    return api.post<CreateCheckoutSessionResponse>('/payments/create-checkout-session/', { plan });
  },
};