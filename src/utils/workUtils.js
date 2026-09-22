export function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function getVehicleLabel(record = {}) {
  const make = record.carMake || record.car || '';
  const model = record.carModel || '';
  const variant = record.variant || '';
  const vehicle = [make, model, variant].filter(Boolean).join(' ').trim();
  return vehicle || record.plate || '';
}

export function clientMatches(client, query) {
  const needle = normalizeText(query);
  if (!needle) return true;

  const haystack = [
    client.name,
    client.phone,
    client.plate,
    client.carMake,
    client.carModel,
    client.variant,
    client.car,
  ].map(normalizeText).join(' ');

  return haystack.includes(needle);
}

export function jobMatches(job, query) {
  const needle = normalizeText(query);
  if (!needle) return true;

  const workItems = Array.isArray(job.workItems) ? job.workItems.join(' ') : '';
  const haystack = [
    job.clientName,
    job.phone,
    job.plate,
    job.carMake,
    job.carModel,
    job.variant,
    job.car,
    job.service,
    workItems,
    job.materials,
    job.notes,
    job.mechanicName,
  ].map(normalizeText).join(' ');

  return haystack.includes(needle);
}

export function bookingMatches(booking, query) {
  const needle = normalizeText(query);
  if (!needle) return true;

  const haystack = [
    booking.clientName,
    booking.phone,
    booking.plate,
    booking.carMake,
    booking.carModel,
    booking.variant,
    booking.car,
    booking.service,
    booking.assignedMechanicName,
  ].map(normalizeText).join(' ');

  return haystack.includes(needle);
}

export function sameClientCandidate(clients, candidate) {
  const phone = normalizeText(candidate.phone);
  const plate = normalizeText(candidate.plate).replace(/\s/g, '');

  if (candidate.id) {
    return clients.find((client) => client.id === candidate.id) || null;
  }

  if (phone) {
    const byPhone = clients.find((client) => normalizeText(client.phone) === phone);
    if (byPhone) return byPhone;
  }

  if (plate) {
    return clients.find((client) => normalizeText(client.plate).replace(/\s/g, '') === plate) || null;
  }

  return null;
}
