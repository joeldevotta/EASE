import { authService, AuthUser } from './authService';
import { appConfig } from '../config/appConfig';

const TOKEN_KEY = 'ease_student_access_token';

function apiUrl(path: string) {
  if (!appConfig.apiBaseUrl) throw new Error('Student authentication API is not configured. Set VITE_API_BASE_URL to your Spring Boot API URL.');
  return `${appConfig.apiBaseUrl.replace(/\/$/, '')}${path}`;
}

async function readResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'The request could not be completed.');
  return body;
}

export const studentAuthApi = {
  async register(registerNumber: string, password: string): Promise<{ message: string; status: string }> {
    const response = await fetch(apiUrl('/auth/student/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registerNumber: registerNumber.trim().toUpperCase(), password }),
    });
    return readResponse(response);
  },

  async login(registerNumber: string, password: string): Promise<{ user: AuthUser }> {
    const response = await fetch(apiUrl('/auth/student/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registerNumber: registerNumber.trim().toUpperCase(), password }),
    });
    const body = await readResponse(response);
    if (!body.token || !body.user) throw new Error('The server returned an invalid login response.');
    window.sessionStorage.setItem(TOKEN_KEY, body.token);
    authService.setSession({ ...body.user, loggedInAt: new Date().toISOString() });
    return { user: authService.getSession()! };
  },

  async currentUser(): Promise<AuthUser> {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Your student session has expired. Please sign in again.');
    const response = await fetch(apiUrl('/auth/student/me'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await readResponse(response);
    return { ...user, loggedInAt: authService.getSession()?.loggedInAt || new Date().toISOString() };
  },

  clearToken() {
    try { window.sessionStorage.removeItem(TOKEN_KEY); } catch { /* storage may be unavailable */ }
  },
};
