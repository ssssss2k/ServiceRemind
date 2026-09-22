// Development-only identity seed for ServiceRemind 8.8.
// Demo credentials intentionally live in the browser so the UI can be tested
// before Supabase is connected. Never use this adapter with real customer data.
export const DEFAULT_ORGANIZATION_ID = 'ORG7DMO';

export const DEMO_ORGANIZATIONS = [
  {
    id: DEFAULT_ORGANIZATION_ID,
    name: 'Baltic Garage OÜ',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
];

export const DEMO_ACCOUNTS = [
  {
    id: 'SR7A2QX',
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: 'owner@serviceremind.ee',
    password: '1111',
    name: 'Andres Saar',
    role: 'owner',
    active: true,
  },
  {
    id: 'SR4M9KP',
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: 'meh@serviceremind.ee',
    password: '1111',
    name: 'Peeter Tamm',
    role: 'mechanic',
    active: true,
  },
  {
    id: 'SR6K2MV',
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: 'maksim@serviceremind.ee',
    password: '1111',
    name: 'Maksim Orlov',
    role: 'mechanic',
    active: true,
  },
  {
    id: 'SR8R5TN',
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: 'karl@serviceremind.ee',
    password: '1111',
    name: 'Karl Rosenberg',
    role: 'mechanic',
    active: true,
  },
  {
    id: 'SRADM01',
    organizationId: null,
    email: 'admin@serviceremind.ee',
    password: '1111',
    name: 'ServiceRemind Admin',
    role: 'admin',
    active: true,
  },
];

export const AUTH_STORAGE_KEY = 'serviceremind_demo_session_v085';
export const IDENTITY_STORAGE_KEY = 'serviceremind_demo_identity_v085';
export const LEGACY_AUTH_STORAGE_KEYS = [
  'serviceremind_demo_session_v08',
  'serviceremind_demo_session_v07',
  'serviceremind_demo_session_v06',
  'serviceremind_demo_session_v05',
  'serviceremind_demo_session_v04',
  'serviceremind_demo_session_v03',
];
