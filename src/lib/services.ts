export interface ServiceConfig {
  enabled: boolean;
  id: string;
  extra?: string;
}

export function getAnalytics(): {
  ga4: ServiceConfig;
  clarity: ServiceConfig;
} {
  const flag = import.meta.env.PUBLIC_ANALYTICS_ENABLED === 'true';
  const ga4Id = import.meta.env.PUBLIC_GA4_ID?.trim() ?? '';
  const clarityId = import.meta.env.PUBLIC_CLARITY_ID?.trim() ?? '';
  return {
    ga4: {
      enabled: flag && /^G-[A-Z0-9]+$/u.test(ga4Id),
      id: ga4Id,
    },
    clarity: {
      enabled: flag && /^[a-z0-9]+$/u.test(clarityId),
      id: clarityId,
    },
  };
}

export function getAdsense(): {
  enabled: boolean;
  client: string;
  slot: string;
} {
  const flag = import.meta.env.PUBLIC_ADSENSE_ENABLED === 'true';
  const client = import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim() ?? '';
  const slot = import.meta.env.PUBLIC_ADSENSE_SLOT?.trim() ?? '';
  return {
    enabled: flag && /^ca-pub-\d+$/u.test(client) && /^\d+$/u.test(slot),
    client,
    slot,
  };
}

