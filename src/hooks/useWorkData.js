import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_ORGANIZATION_ID } from '../auth/authConfig';
import { sameClientCandidate } from '../utils/workUtils';
import { buildDemoWorkSeed, mergeDemoSeed } from '../data/demoWorkSeed';

const WORK_STORAGE_KEY = 'serviceremind_work_data_v085';
const LEGACY_STORAGE_KEYS = [
  'serviceremind_work_data_v08',
  'serviceremind_work_data_v07',
  'serviceremind_work_data_v06',
  'serviceremind_work_data_v05',
  'serviceremind_work_data_v04',
  'serviceremind_work_data_v03',
  'serviceremind_work_data_v02',
];

const EMPTY_STORE = {
  clients: [],
  bookings: [],
  reminders: [],
  completedJobs: [],
  resourceLinks: [],
  activityLog: [],
};

function createId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findAccountId(accounts, email, fallback = '') {
  if (!email) return fallback;
  return accounts.find((account) => String(account.email).toLowerCase() === String(email).toLowerCase())?.id || fallback;
}

function normalizeClient(client = {}, fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  return {
    ...client,
    id: client.id || createId('client'),
    organizationId: client.organizationId || fallbackOrganizationId,
    name: client.name || '',
    phone: client.phone || '',
    carMake: client.carMake || client.car || '',
    carModel: client.carModel || '',
    variant: client.variant || '',
    plate: client.plate || '',
    createdAt: client.createdAt || new Date().toISOString(),
    updatedAt: client.updatedAt || client.createdAt || new Date().toISOString(),
  };
}

function normalizeBooking(booking = {}, accounts = [], fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  const assignedUserId = booking.assignedUserId
    || booking.assignedMechanicId
    || findAccountId(accounts, booking.assignedMechanicEmail);
  return {
    ...booking,
    id: booking.id || createId('booking'),
    organizationId: booking.organizationId || fallbackOrganizationId,
    clientId: booking.clientId || '',
    clientName: booking.clientName || '',
    phone: booking.phone || '',
    carMake: booking.carMake || booking.car || '',
    carModel: booking.carModel || '',
    variant: booking.variant || '',
    plate: booking.plate || '',
    service: booking.service || '',
    date: booking.date || '',
    time: booking.time || '',
    assignedUserId,
    assignedMechanicId: assignedUserId,
    assignedMechanicEmail: booking.assignedMechanicEmail || '',
    assignedMechanicName: booking.assignedMechanicName || '',
    status: booking.status || 'scheduled',
    createdAt: booking.createdAt || new Date().toISOString(),
    updatedAt: booking.updatedAt || booking.createdAt || new Date().toISOString(),
  };
}

function normalizeJob(job = {}, accounts = [], fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  const workItems = Array.isArray(job.workItems) && job.workItems.length
    ? job.workItems.filter(Boolean)
    : (job.service ? [job.service] : []);
  const mechanicId = job.mechanicId || job.userId || findAccountId(accounts, job.mechanicEmail);

  return {
    ...job,
    id: job.id || createId('job'),
    organizationId: job.organizationId || fallbackOrganizationId,
    clientId: job.clientId || '',
    clientName: job.clientName || '',
    phone: job.phone || '',
    carMake: job.carMake || job.car || '',
    carModel: job.carModel || '',
    variant: job.variant || '',
    plate: job.plate || '',
    workItems,
    materials: job.materials || '',
    mileage: job.mileage || '',
    notes: job.notes || '',
    service: job.service || workItems.join(', '),
    date: job.date || '',
    mechanicId,
    mechanicEmail: job.mechanicEmail || '',
    mechanicName: job.mechanicName || '',
    nextServiceMonths: job.nextServiceMonths || '',
    nextServiceNote: job.nextServiceNote || '',
    nextServiceDueDate: job.nextServiceDueDate || '',
    createdAt: job.createdAt || new Date().toISOString(),
    updatedAt: job.updatedAt || job.createdAt || new Date().toISOString(),
  };
}

function normalizeResourceLink(link = {}, accounts = [], fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  const userId = link.userId || findAccountId(accounts, link.userEmail || link.createdByEmail);
  return {
    ...link,
    id: link.id || createId('link'),
    organizationId: link.organizationId || fallbackOrganizationId,
    title: link.title || '',
    url: link.url || '',
    userId,
    userEmail: link.userEmail || link.createdByEmail || '',
    sortOrder: Number.isFinite(Number(link.sortOrder)) ? Number(link.sortOrder) : 0,
    createdAt: link.createdAt || new Date().toISOString(),
    updatedAt: link.updatedAt || link.createdAt || new Date().toISOString(),
  };
}

function normalizeActivityEntry(entry = {}, accounts = [], fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  const actorUserId = entry.actorUserId || findAccountId(accounts, entry.actorEmail);
  return {
    ...entry,
    id: entry.id || createId('activity'),
    organizationId: entry.organizationId || fallbackOrganizationId,
    actorUserId,
    actorEmail: entry.actorEmail || '',
    actorName: entry.actorName || '',
    actorRole: entry.actorRole || '',
    action: entry.action || '',
    actionLabel: entry.actionLabel || '',
    targetType: entry.targetType || '',
    targetId: entry.targetId || '',
    targetLabel: entry.targetLabel || '',
    details: entry.details || '',
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}

function normalizeReminder(reminder = {}, fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  return {
    ...reminder,
    id: reminder.id || createId('reminder'),
    organizationId: reminder.organizationId || fallbackOrganizationId,
    sourceJobId: reminder.sourceJobId || '',
    clientId: reminder.clientId || '',
    dueDate: reminder.dueDate || '',
    note: reminder.note || '',
    status: reminder.status || 'scheduled',
    createdAt: reminder.createdAt || new Date().toISOString(),
    updatedAt: reminder.updatedAt || reminder.createdAt || new Date().toISOString(),
  };
}

function normalizeStore(parsed, accounts = [], fallbackOrganizationId = DEFAULT_ORGANIZATION_ID) {
  return {
    clients: Array.isArray(parsed?.clients) ? parsed.clients.map((item) => normalizeClient(item, fallbackOrganizationId)) : [],
    bookings: Array.isArray(parsed?.bookings) ? parsed.bookings.map((item) => normalizeBooking(item, accounts, fallbackOrganizationId)) : [],
    reminders: Array.isArray(parsed?.reminders) ? parsed.reminders.map((item) => normalizeReminder(item, fallbackOrganizationId)) : [],
    completedJobs: Array.isArray(parsed?.completedJobs) ? parsed.completedJobs.map((item) => normalizeJob(item, accounts, fallbackOrganizationId)) : [],
    resourceLinks: Array.isArray(parsed?.resourceLinks) ? parsed.resourceLinks.map((item) => normalizeResourceLink(item, accounts, fallbackOrganizationId)) : [],
    activityLog: Array.isArray(parsed?.activityLog) ? parsed.activityLog.map((item) => normalizeActivityEntry(item, accounts, fallbackOrganizationId)) : [],
  };
}

function readStoredData(accounts) {
  const demoSeed = buildDemoWorkSeed(accounts);
  try {
    const raw = localStorage.getItem(WORK_STORAGE_KEY);
    if (raw) {
      const stored = normalizeStore(JSON.parse(raw), accounts);
      return mergeDemoSeed(stored, demoSeed);
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacyRaw = localStorage.getItem(key);
      if (!legacyRaw) continue;
      const migrated = mergeDemoSeed(
        normalizeStore(JSON.parse(legacyRaw), accounts, DEFAULT_ORGANIZATION_ID),
        demoSeed,
      );
      localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(demoSeed));
    return demoSeed;
  } catch {
    return demoSeed;
  }
}

function addMonths(dateString, months) {
  const amount = Number(months);
  if (!dateString || !Number.isFinite(amount) || amount <= 0) return '';
  const date = new Date(`${dateString}T12:00:00`);
  date.setMonth(date.getMonth() + amount);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useWorkData(organizationId, accounts = []) {
  const [store, setStore] = useState(() => readStoredData(accounts));

  useEffect(() => {
    localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const data = useMemo(() => {
    if (!organizationId) return EMPTY_STORE;
    const inOrganization = (item) => item.organizationId === organizationId;
    return {
      clients: store.clients.filter((item) => inOrganization(item) && !item.deletedAt),
      bookings: store.bookings.filter(inOrganization),
      reminders: store.reminders.filter(inOrganization),
      completedJobs: store.completedJobs.filter(inOrganization),
      resourceLinks: store.resourceLinks.filter(inOrganization),
      activityLog: store.activityLog.filter(inOrganization),
    };
  }, [organizationId, store]);

  const saveClient = useCallback((clientInput) => {
    if (!organizationId) return null;
    const now = new Date().toISOString();
    const organizationClients = store.clients.filter((client) => client.organizationId === organizationId && !client.deletedAt);
    const explicit = clientInput.id ? organizationClients.find((client) => client.id === clientInput.id) : null;
    const existing = explicit || sameClientCandidate(organizationClients, clientInput);
    const savedClient = normalizeClient({
      ...(existing || {}),
      ...clientInput,
      id: existing?.id || clientInput.id || createId('client'),
      organizationId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }, organizationId);

    setStore((current) => ({
      ...current,
      clients: existing
        ? current.clients.map((client) => client.id === existing.id ? savedClient : client)
        : [...current.clients, savedClient],
    }));
    return savedClient;
  }, [organizationId, store.clients]);

  const deleteClient = useCallback((clientId) => {
    if (!organizationId) return;
    const now = new Date().toISOString();
    setStore((current) => ({
      ...current,
      clients: current.clients.map((client) => (
        client.organizationId === organizationId && client.id === clientId
          ? { ...client, deletedAt: now, updatedAt: now }
          : client
      )),
    }));
  }, [organizationId]);

  const saveBooking = useCallback((bookingInput) => {
    if (!organizationId) return null;
    const now = new Date().toISOString();
    const bookingId = bookingInput.id || bookingInput.bookingId;
    const existing = bookingId
      ? store.bookings.find((booking) => booking.organizationId === organizationId && booking.id === bookingId)
      : null;
    const assignee = accounts.find((account) => account.id === bookingInput.assignedUserId)
      || accounts.find((account) => String(account.email).toLowerCase() === String(bookingInput.assignedMechanicEmail || '').toLowerCase());
    const savedBooking = normalizeBooking({
      ...(existing || {}),
      ...bookingInput,
      id: existing?.id || bookingId || createId('booking'),
      organizationId,
      assignedUserId: assignee?.id || bookingInput.assignedUserId || existing?.assignedUserId || '',
      assignedMechanicId: assignee?.id || bookingInput.assignedUserId || existing?.assignedUserId || '',
      assignedMechanicEmail: assignee?.email || bookingInput.assignedMechanicEmail || existing?.assignedMechanicEmail || '',
      assignedMechanicName: assignee?.name || bookingInput.assignedMechanicName || existing?.assignedMechanicName || '',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }, accounts, organizationId);

    setStore((current) => ({
      ...current,
      bookings: existing
        ? current.bookings.map((booking) => booking.id === existing.id ? savedBooking : booking)
        : [...current.bookings, savedBooking],
    }));
    return savedBooking;
  }, [accounts, organizationId, store.bookings]);

  const completeBooking = useCallback((bookingId) => {
    if (!organizationId || !bookingId) return;
    const now = new Date().toISOString();
    setStore((current) => ({
      ...current,
      bookings: current.bookings.map((booking) => (
        booking.organizationId === organizationId && booking.id === bookingId
          ? { ...booking, status: 'completed', completedAt: now, updatedAt: now }
          : booking
      )),
    }));
  }, [organizationId]);

  const saveCompletedJob = useCallback((jobInput) => {
    if (!organizationId) return null;
    const now = new Date().toISOString();
    const jobId = jobInput.id || jobInput.jobId;
    const existing = jobId
      ? store.completedJobs.find((job) => job.organizationId === organizationId && job.id === jobId)
      : null;
    const mechanic = accounts.find((account) => account.id === jobInput.mechanicId)
      || accounts.find((account) => String(account.email).toLowerCase() === String(jobInput.mechanicEmail || '').toLowerCase());
    const nextServiceDueDate = addMonths(jobInput.date || existing?.date, jobInput.nextServiceMonths ?? existing?.nextServiceMonths);
    const savedJob = normalizeJob({
      ...(existing || {}),
      ...jobInput,
      id: existing?.id || jobId || createId('job'),
      organizationId,
      mechanicId: mechanic?.id || jobInput.mechanicId || existing?.mechanicId || '',
      mechanicEmail: mechanic?.email || jobInput.mechanicEmail || existing?.mechanicEmail || '',
      mechanicName: mechanic?.name || jobInput.mechanicName || existing?.mechanicName || '',
      nextServiceDueDate,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }, accounts, organizationId);

    setStore((current) => {
      const existingReminder = current.reminders.find((reminder) => (
        reminder.organizationId === organizationId && reminder.sourceJobId === savedJob.id
      ));
      const nextReminders = [...current.reminders];

      if (savedJob.nextServiceDueDate) {
        const reminderWasSent = existingReminder?.status === 'sent';
        const reminder = normalizeReminder({
          ...(!reminderWasSent && existingReminder ? existingReminder : {}),
          id: !reminderWasSent && existingReminder ? existingReminder.id : createId('reminder'),
          organizationId,
          sourceJobId: savedJob.id,
          clientId: savedJob.clientId,
          dueDate: savedJob.nextServiceDueDate,
          note: savedJob.nextServiceNote || savedJob.service,
          status: 'scheduled',
          supersedesReminderId: reminderWasSent ? existingReminder.id : '',
          createdAt: !reminderWasSent && existingReminder ? existingReminder.createdAt : now,
          updatedAt: now,
        }, organizationId);
        if (existingReminder && !reminderWasSent) {
          const index = nextReminders.findIndex((item) => item.id === existingReminder.id);
          nextReminders[index] = reminder;
        } else nextReminders.push(reminder);
      } else if (existingReminder && existingReminder.status !== 'sent') {
        const index = nextReminders.findIndex((item) => item.id === existingReminder.id);
        nextReminders[index] = { ...existingReminder, status: 'cancelled', dueDate: '', updatedAt: now };
      }

      return {
        ...current,
        completedJobs: existing
          ? current.completedJobs.map((job) => job.id === existing.id ? savedJob : job)
          : [...current.completedJobs, savedJob],
        reminders: nextReminders,
      };
    });

    return savedJob;
  }, [accounts, organizationId, store.completedJobs]);

  const saveResourceLink = useCallback((linkInput) => {
    if (!organizationId) return null;
    const now = new Date().toISOString();
    const existing = linkInput.id
      ? store.resourceLinks.find((link) => link.organizationId === organizationId && link.id === linkInput.id)
      : null;
    const userAccount = accounts.find((account) => account.id === linkInput.userId)
      || accounts.find((account) => String(account.email).toLowerCase() === String(linkInput.userEmail || '').toLowerCase());
    const resolvedUserId = userAccount?.id || linkInput.userId || existing?.userId || '';
    const personalLinks = store.resourceLinks.filter((link) => link.organizationId === organizationId && link.userId === resolvedUserId);
    const nextSortOrder = personalLinks.length
      ? Math.max(...personalLinks.map((link) => Number(link.sortOrder) || 0)) + 1
      : 0;
    const savedLink = normalizeResourceLink({
      ...(existing || {}),
      ...linkInput,
      id: existing?.id || linkInput.id || createId('link'),
      organizationId,
      userId: resolvedUserId,
      userEmail: userAccount?.email || linkInput.userEmail || existing?.userEmail || '',
      sortOrder: existing?.sortOrder ?? linkInput.sortOrder ?? nextSortOrder,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }, accounts, organizationId);

    setStore((current) => ({
      ...current,
      resourceLinks: existing
        ? current.resourceLinks.map((link) => link.id === existing.id ? savedLink : link)
        : [...current.resourceLinks, savedLink],
    }));
    return savedLink;
  }, [accounts, organizationId, store.resourceLinks]);

  const deleteResourceLink = useCallback((linkId) => {
    if (!organizationId) return;
    setStore((current) => ({
      ...current,
      resourceLinks: current.resourceLinks.filter((link) => !(link.organizationId === organizationId && link.id === linkId)),
    }));
  }, [organizationId]);

  const moveResourceLink = useCallback((linkId, offset, userId) => {
    if (!organizationId || !linkId || !userId || !offset) return;
    setStore((current) => {
      const personal = current.resourceLinks
        .filter((link) => link.organizationId === organizationId && link.userId === userId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
      const index = personal.findIndex((link) => link.id === linkId);
      if (index < 0) return current;

      const nextIndex = Math.max(0, Math.min(personal.length - 1, index + offset));
      if (nextIndex === index) return current;

      const reordered = [...personal];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(nextIndex, 0, moved);
      const order = new Map(reordered.map((link, orderIndex) => [link.id, orderIndex]));

      return {
        ...current,
        resourceLinks: current.resourceLinks.map((link) => order.has(link.id)
          ? { ...link, sortOrder: order.get(link.id), updatedAt: new Date().toISOString() }
          : link),
      };
    });
  }, [organizationId]);

  const addActivityEntry = useCallback((entry) => {
    if (!organizationId) return null;
    const actor = accounts.find((account) => account.id === entry.actorUserId)
      || accounts.find((account) => String(account.email).toLowerCase() === String(entry.actorEmail || '').toLowerCase());
    const normalized = normalizeActivityEntry({
      ...entry,
      organizationId,
      actorUserId: actor?.id || entry.actorUserId || '',
      actorEmail: actor?.email || entry.actorEmail || '',
      actorName: actor?.name || entry.actorName || '',
      actorRole: actor?.role || entry.actorRole || '',
    }, accounts, organizationId);
    setStore((current) => ({ ...current, activityLog: [normalized, ...current.activityLog] }));
    return normalized;
  }, [accounts, organizationId]);

  return {
    data,
    saveClient,
    deleteClient,
    saveBooking,
    completeBooking,
    saveCompletedJob,
    saveResourceLink,
    deleteResourceLink,
    moveResourceLink,
    addActivityEntry,
  };
}
