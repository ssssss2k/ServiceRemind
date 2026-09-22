import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AUTH_STORAGE_KEY,
  DEMO_ACCOUNTS,
  DEMO_ORGANIZATIONS,
  IDENTITY_STORAGE_KEY,
  LEGACY_AUTH_STORAGE_KEYS,
} from './authConfig';

const DEMO_SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const AuthContext = createContext(null);

function randomPart(length) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

function createShortId(prefix = 'SR') {
  return `${prefix}${randomPart(Math.max(1, 7 - prefix.length))}`.slice(0, 7);
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}


function readLegacyProfiles() {
  const keys = ['serviceremind_demo_profiles_v07', 'serviceremind_demo_profiles_v06', 'serviceremind_demo_profiles_v05'];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) || {};
    } catch {
      // Ignore malformed legacy demo data.
    }
  }
  return {};
}

function seedIdentity() {
  const legacyProfiles = readLegacyProfiles();
  return {
    organizations: DEMO_ORGANIZATIONS.map((organization) => ({ ...organization })),
    accounts: DEMO_ACCOUNTS.map((account) => ({
      ...account,
      name: legacyProfiles[account.email]?.name || account.name,
      email: normalizeEmail(account.email),
      createdAt: account.createdAt || new Date().toISOString(),
      updatedAt: account.updatedAt || new Date().toISOString(),
    })),
  };
}

function readIdentity() {
  try {
    const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
    if (!raw) {
      const seeded = seedIdentity();
      localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    const organizations = Array.isArray(parsed?.organizations) ? parsed.organizations : [];
    const accounts = Array.isArray(parsed?.accounts) ? parsed.accounts : [];

    // Keep seeded demo/admin accounts available after upgrading from an earlier 0.8 snapshot.
    const mergedAccounts = [...accounts];
    DEMO_ACCOUNTS.forEach((seed) => {
      if (!mergedAccounts.some((account) => account.id === seed.id)) mergedAccounts.push({ ...seed });
    });
    const mergedOrganizations = [...organizations];
    DEMO_ORGANIZATIONS.forEach((seed) => {
      if (!mergedOrganizations.some((organization) => organization.id === seed.id)) mergedOrganizations.push({ ...seed });
    });

    return {
      organizations: mergedOrganizations,
      accounts: mergedAccounts.map((account) => ({
        ...account,
        email: normalizeEmail(account.email),
        active: account.active !== false,
      })),
    };
  } catch {
    return seedIdentity();
  }
}

function persistIdentity(identity) {
  localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(identity));
}

function makeSession(account, signedInAt = new Date().toISOString()) {
  return {
    id: account.id,
    organizationId: account.organizationId || null,
    email: account.email,
    name: account.name,
    role: account.role,
    signedInAt,
  };
}

function readStoredSession(identity) {
  try {
    const keys = [AUTH_STORAGE_KEY, ...LEGACY_AUTH_STORAGE_KEYS];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const stored = JSON.parse(raw);
      const signedInAt = new Date(stored?.signedInAt || 0).getTime();
      if (!signedInAt || Date.now() - signedInAt > DEMO_SESSION_MAX_AGE_MS) {
        localStorage.removeItem(key);
        continue;
      }

      const account = identity.accounts.find((item) => (
        item.id === stored?.id || normalizeEmail(item.email) === normalizeEmail(stored?.email)
      ));
      if (!account || account.active === false) continue;
      const session = makeSession(account, stored.signedInAt);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [identity, setIdentity] = useState(readIdentity);
  const [user, setUser] = useState(() => readStoredSession(readIdentity()));

  const commitIdentity = useCallback((nextIdentity) => {
    setIdentity(nextIdentity);
    persistIdentity(nextIdentity);
  }, []);

  const login = useCallback((email, password) => {
    const normalized = normalizeEmail(email);
    const account = identity.accounts.find((item) => (
      normalizeEmail(item.email) === normalized && item.active !== false
    ));
    if (!account || String(password) !== String(account.password)) return null;

    const session = makeSession(account);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }, [identity.accounts]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    LEGACY_AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setUser(null);
  }, []);

  const updateSelf = useCallback(({ name, email, currentPassword, newPassword }) => {
    if (!user) return { ok: false, code: 'not_authenticated' };
    const account = identity.accounts.find((item) => item.id === user.id);
    if (!account) return { ok: false, code: 'account_missing' };

    const nextName = String(name ?? account.name).trim();
    const nextEmail = normalizeEmail(email ?? account.email);
    const wantsSensitiveChange = nextEmail !== normalizeEmail(account.email) || Boolean(newPassword);

    if (!nextName || !nextEmail) return { ok: false, code: 'required' };
    if (wantsSensitiveChange && String(currentPassword || '') !== String(account.password)) {
      return { ok: false, code: 'wrong_password' };
    }
    if (identity.accounts.some((item) => item.id !== account.id && normalizeEmail(item.email) === nextEmail)) {
      return { ok: false, code: 'email_exists' };
    }
    if (newPassword && String(newPassword).length < 4) return { ok: false, code: 'password_short' };

    const now = new Date().toISOString();
    const updatedAccount = {
      ...account,
      name: nextName,
      email: nextEmail,
      password: newPassword ? String(newPassword) : account.password,
      updatedAt: now,
    };
    const nextIdentity = {
      ...identity,
      accounts: identity.accounts.map((item) => item.id === account.id ? updatedAccount : item),
    };
    commitIdentity(nextIdentity);

    const nextSession = makeSession(updatedAccount, user.signedInAt);
    setUser(nextSession);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    return { ok: true, account: updatedAccount };
  }, [commitIdentity, identity, user]);

  const addMechanic = useCallback(({ name, email, password }) => {
    if (!user || user.role !== 'owner' || !user.organizationId) return { ok: false, code: 'forbidden' };
    const normalized = normalizeEmail(email);
    if (!String(name || '').trim() || !normalized || !String(password || '').trim()) return { ok: false, code: 'required' };
    if (identity.accounts.some((item) => normalizeEmail(item.email) === normalized)) return { ok: false, code: 'email_exists' };

    let id = createShortId('SR');
    while (identity.accounts.some((item) => item.id === id)) id = createShortId('SR');
    const now = new Date().toISOString();
    const account = {
      id,
      organizationId: user.organizationId,
      email: normalized,
      password: String(password),
      name: String(name).trim(),
      role: 'mechanic',
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    commitIdentity({ ...identity, accounts: [...identity.accounts, account] });
    return { ok: true, account };
  }, [commitIdentity, identity, user]);

  const removeMechanic = useCallback(({ mechanicId, password }) => {
    if (!user || user.role !== 'owner' || !user.organizationId) return { ok: false, code: 'forbidden' };
    const ownerAccount = identity.accounts.find((item) => item.id === user.id);
    if (!ownerAccount || String(password || '') !== String(ownerAccount.password)) {
      return { ok: false, code: 'wrong_password' };
    }
    const mechanic = identity.accounts.find((item) => (
      item.id === mechanicId
      && item.organizationId === user.organizationId
      && item.role === 'mechanic'
      && item.active !== false
    ));
    if (!mechanic) return { ok: false, code: 'account_missing' };

    const now = new Date().toISOString();
    commitIdentity({
      ...identity,
      accounts: identity.accounts.map((item) => item.id === mechanic.id
        ? { ...item, active: false, deactivatedAt: now, updatedAt: now }
        : item),
    });
    return { ok: true, account: mechanic };
  }, [commitIdentity, identity, user]);

  const createOrganization = useCallback(({ organizationName, ownerName, ownerEmail, ownerPassword }) => {
    if (!user || user.role !== 'admin') return { ok: false, code: 'forbidden' };
    const normalized = normalizeEmail(ownerEmail);
    if (![organizationName, ownerName, normalized, ownerPassword].every((value) => String(value || '').trim())) {
      return { ok: false, code: 'required' };
    }
    if (identity.accounts.some((item) => normalizeEmail(item.email) === normalized)) return { ok: false, code: 'email_exists' };

    let organizationId = createShortId('ORG');
    while (identity.organizations.some((item) => item.id === organizationId)) organizationId = createShortId('ORG');
    let ownerId = createShortId('SR');
    while (identity.accounts.some((item) => item.id === ownerId)) ownerId = createShortId('SR');
    const now = new Date().toISOString();
    const organization = { id: organizationId, name: String(organizationName).trim(), createdAt: now };
    const owner = {
      id: ownerId,
      organizationId,
      email: normalized,
      password: String(ownerPassword),
      name: String(ownerName).trim(),
      role: 'owner',
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    commitIdentity({
      organizations: [...identity.organizations, organization],
      accounts: [...identity.accounts, owner],
    });
    return { ok: true, organization, owner };
  }, [commitIdentity, identity, user]);

  const deleteOrganization = useCallback(({ organizationId, password }) => {
    if (!user || user.role !== 'admin') return { ok: false, code: 'forbidden' };
    const adminAccount = identity.accounts.find((item) => item.id === user.id);
    if (!adminAccount || String(password || '') !== String(adminAccount.password)) {
      return { ok: false, code: 'wrong_password' };
    }
    const organization = identity.organizations.find((item) => item.id === organizationId && !item.deletedAt);
    if (!organization) return { ok: false, code: 'organization_missing' };

    const now = new Date().toISOString();
    commitIdentity({
      organizations: identity.organizations.map((item) => item.id === organizationId
        ? { ...item, deletedAt: now, updatedAt: now }
        : item),
      accounts: identity.accounts.map((item) => item.organizationId === organizationId
        ? { ...item, active: false, deactivatedAt: now, updatedAt: now }
        : item),
    });
    return { ok: true, organization };
  }, [commitIdentity, identity, user]);

  const accounts = useMemo(() => identity.accounts.map(({ password, ...account }) => account), [identity.accounts]);
  const organizations = useMemo(() => identity.organizations.filter((item) => !item.deletedAt), [identity.organizations]);
  const organization = useMemo(() => (
    user?.organizationId ? identity.organizations.find((item) => item.id === user.organizationId) || null : null
  ), [identity.organizations, user?.organizationId]);
  const organizationAccounts = useMemo(() => (
    user?.organizationId
      ? accounts.filter((account) => account.organizationId === user.organizationId && account.active !== false)
      : []
  ), [accounts, user?.organizationId]);

  const value = useMemo(() => ({
    user,
    accounts,
    organizations,
    organization,
    organizationAccounts,
    isAuthenticated: Boolean(user),
    login,
    logout,
    updateSelf,
    addMechanic,
    removeMechanic,
    createOrganization,
    deleteOrganization,
  }), [
    user,
    accounts,
    organizations,
    organization,
    organizationAccounts,
    login,
    logout,
    updateSelf,
    addMechanic,
    removeMechanic,
    createOrganization,
    deleteOrganization,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
