import { api } from './api';
import type {
  DevOpsOAuthStartResponse,
  DevOpsOAuthCallbackPayload,
  DevOpsOAuthCallbackResponse,
  DevOpsStory,
} from './types';

export const azureService = {
  // ─── OAuth Flow ──────────────────────────────────────────────────────────

  /** GET /api/devops/oauth/start/ → get authorize URL for Azure DevOps OAuth */
  async startOAuth(): Promise<DevOpsOAuthStartResponse> {
    return api.get<DevOpsOAuthStartResponse>('/devops/oauth/start/');
  },

  /** POST /api/devops/oauth/callback/ → exchange code for connection */
  async completeOAuth(payload: DevOpsOAuthCallbackPayload): Promise<DevOpsOAuthCallbackResponse> {
    return api.post<DevOpsOAuthCallbackResponse>('/devops/oauth/callback/', payload);
  },

  // ─── Stories ──────────────────────────────────────────────────────────────

  /** GET /api/devops/stories/ → list user stories from Azure DevOps */
  async getStories(): Promise<DevOpsStory[]> {
    return api.get<DevOpsStory[]>('/devops/stories/');
  },
};
