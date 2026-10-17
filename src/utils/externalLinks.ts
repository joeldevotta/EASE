import { appConfig } from '../config/appConfig';
import { isValidHttpUrl } from './validation';

/**
 * Safely open external link in new tab
 */
export function openExternalUrl(url?: string): boolean {
  if (!url || !isValidHttpUrl(url)) {
    return false;
  }
  window.open(url.trim(), '_blank', 'noopener,noreferrer');
  return true;
}

/**
 * Check if OD Portal URL is configured
 */
export function isOdPortalConfigured(): boolean {
  return (
    Boolean(appConfig.odPortalUrl) &&
    isValidHttpUrl(appConfig.odPortalUrl)
  );
}

/**
 * Open OD Portal or return false if unconfigured
 */
export function openOdPortal(): boolean {
  if (isOdPortalConfigured()) {
    return openExternalUrl(appConfig.odPortalUrl);
  }
  return false;
}
