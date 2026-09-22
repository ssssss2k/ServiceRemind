import { useEffect, useMemo, useState } from 'react';
import { clientMatches, getVehicleLabel } from '../utils/workUtils';
import { ChevronRightIcon } from './WorkspaceIcons';

const CLIENT_FIELDS = {
  clientId: '',
  name: '',
  phone: '',
  carMake: '',
  carModel: '',
  variant: '',
  plate: '',
};

const INITIAL = {
  client: { ...CLIENT_FIELDS },
  booking: {
    ...CLIENT_FIELDS,
    service: '',
    date: '',
    time: '',
    assignedUserId: '',
    assignedMechanicEmail: '',
    notes: '',
  },
  job: {
    ...CLIENT_FIELDS,
    date: '',
    mileage: '',
    workItems: [''],
    materials: '',
    notes: '',
    nextServiceMonths: '',
    nextServiceNote: '',
  },
};

function clientToForm(client) {
  return {
    clientId: client.id,
    name: client.name || '',
    phone: client.phone || '',
    carMake: client.carMake || client.car || '',
    carModel: client.carModel || '',
    variant: client.variant || '',
    plate: client.plate || '',
  };
}

function FieldLabel({ children, required = false }) {
  return <span className="work-field-label">{children}{required && <b className="required-mark">*</b>}</span>;
}

export default function WorkActionModal({
  mode,
  initialData = null,
  clients,
  mechanics = [],
  currentUser = null,
  t,
  workCopy,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(INITIAL.client);
  const [clientSearch, setClientSearch] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mode) return;
    const base = { ...INITIAL[mode] };
    if (Array.isArray(base.workItems)) base.workItems = [...base.workItems];
    if (mode === 'job' && !base.date) base.date = new Date().toISOString().slice(0, 10);
    setForm({ ...base, ...(initialData || {}) });
    setClientSearch(initialData?.clientId ? (initialData.name || '') : '');
    setShowAllClients(false);
    setError('');
  }, [mode, initialData]);

  useEffect(() => {
    if (!mode) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, onClose]);

  const title = useMemo(() => {
    if (mode === 'client') return initialData?.id ? workCopy.editClient : workCopy.addClient;
    if (mode === 'booking') return initialData?.id || initialData?.bookingId ? workCopy.editBooking : workCopy.createBooking;
    if (mode === 'job') return initialData?.id || initialData?.jobId ? workCopy.editServiceRecord : workCopy.completeService;
    return '';
  }, [mode, initialData, workCopy]);

  const clientSuggestions = useMemo(() => {
    if (!clientSearch && !showAllClients) return [];
    return clients
      .filter((client) => showAllClients || clientMatches(client, clientSearch))
      .slice(0, 8);
  }, [clients, clientSearch, showAllClients]);

  if (!mode) return null;

  const update = (field) => (event) => {
    setError('');
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const pickClient = (client) => {
    setForm((current) => ({ ...current, ...clientToForm(client) }));
    setClientSearch(client.name || '');
    setShowAllClients(false);
    setError('');
  };

  const clearClient = () => {
    setForm((current) => ({ ...current, ...CLIENT_FIELDS }));
    setClientSearch('');
    setShowAllClients(false);
    setError('');
  };

  const updateWorkItem = (index, value) => {
    setError('');
    setForm((current) => ({
      ...current,
      workItems: current.workItems.map((item, itemIndex) => itemIndex === index ? value : item),
    }));
  };

  const addWorkItem = () => setForm((current) => ({ ...current, workItems: [...current.workItems, ''] }));

  const removeWorkItem = (index) => {
    setForm((current) => {
      if (current.workItems.length === 1) return current;
      return { ...current, workItems: current.workItems.filter((_, itemIndex) => itemIndex !== index) };
    });
  };

  const validate = (payload) => {
    const baseFields = [payload.name, payload.phone];
    if (mode !== 'client') baseFields.push(payload.carMake, payload.carModel);
    if (baseFields.some((value) => !String(value || '').trim())) return false;

    if (mode === 'booking') {
      if (![payload.service, payload.date, payload.time].every((value) => String(value || '').trim())) return false;
      if (currentUser?.role === 'owner' && mechanics.length > 0 && !payload.assignedUserId) return false;
    }

    if (mode === 'job') {
      if (!payload.date || payload.workItems.length === 0) return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = mode === 'job'
      ? { ...form, workItems: form.workItems.map((item) => item.trim()).filter(Boolean) }
      : form;

    if (!validate(payload)) {
      setError(workCopy.fillRequiredFields);
      return;
    }

    setError('');
    onSubmit(mode, payload);
  };

  const renderClientLookup = () => (
    <section className="work-form-section client-lookup-section">
      <div className="work-form-section-head compact-client-head">
        <strong>{workCopy.findClient}</strong>
        {form.clientId && (
          <button type="button" className="inline-text-btn" onClick={clearClient}>{workCopy.useNewClient}</button>
        )}
      </div>

      <div className="client-picker client-picker-compact">
        <div className="client-picker-search-row">
          <input
            type="search"
            value={clientSearch}
            onChange={(event) => {
              setClientSearch(event.target.value);
              setShowAllClients(false);
            }}
            placeholder={workCopy.clientSearchPlaceholder}
            autoComplete="off"
          />
          <button
            type="button"
            className={showAllClients ? 'client-picker-list-toggle open' : 'client-picker-list-toggle'}
            aria-expanded={showAllClients}
            onClick={() => setShowAllClients((value) => !value)}
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>

        {clientSuggestions.length > 0 && (
          <div className="client-picker-results">
            {clientSuggestions.map((client) => (
              <button type="button" key={client.id} onClick={() => pickClient(client)}>
                <div>
                  <strong>{client.name}</strong>
                  <span>{[client.phone, getVehicleLabel(client), client.plate].filter(Boolean).join(' · ')}</span>
                </div>
                <span className="client-picker-arrow"><ChevronRightIcon size={17} /></span>
              </button>
            ))}
          </div>
        )}
      </div>

      {form.clientId && <div className="selected-client-chip">✓ {workCopy.existingClientSelected}</div>}
    </section>
  );

  const editingExistingJob = mode === 'job' && Boolean(initialData?.id || initialData?.jobId);
  const clientLocked = editingExistingJob || (currentUser?.role === 'mechanic' && Boolean(form.clientId));

  const renderClientFields = () => (
    <section className="work-form-section">
      <div className="work-form-section-title">{workCopy.clientAndVehicle}</div>
      <div className="work-form-grid">
        <label>
          <FieldLabel required>{t.workClientName}</FieldLabel>
          <input value={form.name} onChange={update('name')} readOnly={clientLocked} />
        </label>
        <label>
          <FieldLabel required>{t.workPhone}</FieldLabel>
          <input value={form.phone} onChange={update('phone')} readOnly={clientLocked} type="tel" />
        </label>
      </div>
      <div className="work-form-grid vehicle-grid">
        <label>
          <FieldLabel required={mode !== 'client'}>{workCopy.carMake}</FieldLabel>
          <input value={form.carMake} onChange={update('carMake')} readOnly={clientLocked} placeholder="Volvo" />
        </label>
        <label>
          <FieldLabel required={mode !== 'client'}>{workCopy.carModel}</FieldLabel>
          <input value={form.carModel} onChange={update('carModel')} readOnly={clientLocked} placeholder="XC60" />
        </label>
      </div>
      <div className="work-form-grid">
        <label>
          <FieldLabel>{workCopy.variantOptional}</FieldLabel>
          <input value={form.variant} onChange={update('variant')} readOnly={clientLocked} placeholder="B5 AWD" />
        </label>
        <label>
          <FieldLabel>{t.workPlate}</FieldLabel>
          <input value={form.plate} onChange={update('plate')} readOnly={clientLocked} placeholder="123ABC" />
        </label>
      </div>
    </section>
  );

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={mode === 'job' ? 'work-modal work-modal-wide work-modal-clean' : 'work-modal work-modal-clean'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="work-modal-close" aria-label={t.workClose} onClick={onClose}>×</button>
        <h2 id="work-modal-title">{title}</h2>

        <form className="work-form" onSubmit={handleSubmit} noValidate>
          {(mode === 'booking' || (mode === 'job' && !editingExistingJob)) && renderClientLookup()}

          {(mode === 'client' || mode === 'booking' || mode === 'job') && renderClientFields()}

          {mode === 'booking' && (
            <section className="work-form-section">
              <div className="work-form-section-title">{workCopy.bookingDetails}</div>
              <label>
                <FieldLabel required>{workCopy.plannedWork}</FieldLabel>
                <textarea value={form.service} onChange={update('service')} rows="3" placeholder={workCopy.plannedWorkPlaceholder} />
              </label>
              <div className="work-form-grid">
                <label>
                  <FieldLabel required>{t.workDate}</FieldLabel>
                  <input value={form.date} onChange={update('date')} type="date" />
                </label>
                <label>
                  <FieldLabel required>{t.workTime}</FieldLabel>
                  <input value={form.time} onChange={update('time')} type="time" />
                </label>
              </div>
              {currentUser?.role === 'owner' && mechanics.length > 0 && (
                <label>
                  <FieldLabel required>{workCopy.assignedMechanic}</FieldLabel>
                  <select value={form.assignedUserId || ''} onChange={update('assignedUserId')}>
                    <option value="">{workCopy.chooseMechanic}</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.id}>{mechanic.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                <FieldLabel>{workCopy.bookingNotesOptional}</FieldLabel>
                <textarea value={form.notes} onChange={update('notes')} rows="2" />
              </label>
            </section>
          )}

          {mode === 'job' && (
            <section className="work-form-section">
              <div className="work-form-section-title">{workCopy.workPerformed}</div>
              <div className="work-form-grid">
                <label>
                  <FieldLabel required>{t.workDate}</FieldLabel>
                  <input value={form.date} onChange={update('date')} type="date" />
                </label>
                <label>
                  <FieldLabel>{workCopy.mileageOptional}</FieldLabel>
                  <input value={form.mileage} onChange={update('mileage')} inputMode="numeric" placeholder="120000 km" />
                </label>
              </div>

              <div className="work-items-editor">
                <div className="work-items-editor-head">
                  <span>{workCopy.workItems}<b className="required-mark">*</b></span>
                  <button type="button" className="inline-text-btn" onClick={addWorkItem}>+ {workCopy.addWorkLine}</button>
                </div>
                {form.workItems.map((item, index) => (
                  <div className="work-item-row" key={`work-item-${index}`}>
                    <span className="work-item-number">{index + 1}</span>
                    <input value={item} onChange={(event) => updateWorkItem(index, event.target.value)} placeholder={workCopy.workItemPlaceholder} />
                    <button type="button" className="work-item-remove" aria-label={workCopy.removeWorkLine} onClick={() => removeWorkItem(index)} disabled={form.workItems.length === 1}>×</button>
                  </div>
                ))}
              </div>

              <label>
                <FieldLabel>{workCopy.materialsOptional}</FieldLabel>
                <textarea value={form.materials} onChange={update('materials')} rows="3" placeholder={workCopy.materialsPlaceholder} />
              </label>
              <label>
                <FieldLabel>{workCopy.notesOptional}</FieldLabel>
                <textarea value={form.notes} onChange={update('notes')} rows="3" placeholder={workCopy.notesPlaceholder} />
              </label>

              <div className="next-service-block">
                <div className="work-form-section-title">{workCopy.nextService}</div>
                <div className="work-form-grid">
                  <label>
                    <FieldLabel>{workCopy.nextServiceMonths}</FieldLabel>
                    <input type="number" min="1" max="60" value={form.nextServiceMonths || ''} onChange={update('nextServiceMonths')} placeholder="8" />
                  </label>
                  <label>
                    <FieldLabel>{workCopy.nextServiceNote}</FieldLabel>
                    <input value={form.nextServiceNote || ''} onChange={update('nextServiceNote')} placeholder={workCopy.nextServiceNotePlaceholder} />
                  </label>
                </div>
                <p className="form-field-hint">{workCopy.nextServiceMonthsHint}</p>
              </div>
            </section>
          )}

          {error && <p className="work-form-error" role="alert">{error}</p>}

          <div className="work-form-actions">
            <button type="button" className="work-secondary-btn" onClick={onClose}>{t.workCancel}</button>
            <button type="submit" className="work-primary-btn">{mode === 'job' ? workCopy.saveServiceRecord : t.workSave}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
