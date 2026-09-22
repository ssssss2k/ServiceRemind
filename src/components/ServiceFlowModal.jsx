import { useEffect, useMemo, useState } from 'react';
import { clientMatches, getVehicleLabel } from '../utils/workUtils';
import { ChevronRightIcon } from './WorkspaceIcons';


function FieldLabel({ children, required = false }) {
  return <span className="work-field-label">{children}{required && <b className="required-mark">*</b>}</span>;
}

const EMPTY_CLIENT = {
  clientId: '',
  name: '',
  phone: '',
  carMake: '',
  carModel: '',
  variant: '',
  plate: '',
};

const EMPTY_FORM = {
  ...EMPTY_CLIENT,
  sourceBookingId: '',
  date: '',
  mileage: '',
  workItems: [''],
  materials: '',
  notes: '',
  nextServiceMonths: '',
  nextServiceNote: '',
};

function bookingToForm(booking) {
  return {
    clientId: booking.clientId || '',
    name: booking.clientName || '',
    phone: booking.phone || '',
    carMake: booking.carMake || booking.car || '',
    carModel: booking.carModel || '',
    variant: booking.variant || '',
    plate: booking.plate || '',
    sourceBookingId: booking.id || '',
    date: booking.date || new Date().toISOString().slice(0, 10),
    mileage: '',
    workItems: booking.service ? [booking.service] : [''],
    materials: '',
    notes: booking.notes || '',
    nextServiceMonths: '',
    nextServiceNote: '',
  };
}

function clientToFields(client) {
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

export default function ServiceFlowModal({
  open,
  initialBooking = null,
  todayBookings = [],
  clients = [],
  currentUser,
  t,
  workCopy,
  onClose,
  onSubmit,
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [clientSearch, setClientSearch] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const base = initialBooking
      ? bookingToForm(initialBooking)
      : { ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10), workItems: [''] };
    setForm(base);
    setStep(initialBooking ? 2 : 1);
    setClientSearch(initialBooking?.clientName || '');
    setShowAllClients(false);
    setError('');
  }, [open, initialBooking]);

  useEffect(() => {
    if (!open) return undefined;
    const key = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, onClose]);

  const suggestions = useMemo(() => {
    if (!clientSearch && !showAllClients) return [];
    return clients
      .filter((client) => showAllClients || clientMatches(client, clientSearch))
      .slice(0, 8);
  }, [clients, clientSearch, showAllClients]);

  if (!open) return null;

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const chooseBooking = (booking) => {
    setForm(bookingToForm(booking));
    setClientSearch(booking.clientName || '');
    setError('');
    setStep(2);
  };

  const chooseUnplanned = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10), workItems: [''] });
    setClientSearch('');
    setError('');
    setStep(2);
  };

  const chooseClient = (client) => {
    setForm((current) => ({ ...current, ...clientToFields(client) }));
    setClientSearch(client.name || '');
    setShowAllClients(false);
  };

  const updateWorkItem = (index, value) => {
    setForm((current) => ({
      ...current,
      workItems: current.workItems.map((item, itemIndex) => itemIndex === index ? value : item),
    }));
  };

  const addWorkItem = () => setForm((current) => ({ ...current, workItems: [...current.workItems, ''] }));
  const removeWorkItem = (index) => setForm((current) => ({
    ...current,
    workItems: current.workItems.length === 1
      ? current.workItems
      : current.workItems.filter((_, itemIndex) => itemIndex !== index),
  }));

  const goToDetails = () => {
    const workItems = form.workItems.map((item) => item.trim()).filter(Boolean);
    if (!form.name.trim() || !form.phone.trim() || !form.carMake.trim() || !form.carModel.trim() || workItems.length === 0) {
      setError(workCopy.fillRequiredFields);
      return;
    }
    setForm((current) => ({ ...current, workItems }));
    setError('');
    setStep(3);
  };

  const save = (event) => {
    event.preventDefault();
    const workItems = form.workItems.map((item) => item.trim()).filter(Boolean);
    if (workItems.length === 0) return;
    onSubmit({ ...form, workItems });
  };

  const clientLocked = currentUser?.role === 'mechanic' && Boolean(form.clientId);

  const quickWorkPresets = [
    workCopy.presetOil,
    workCopy.presetTires,
    workCopy.presetBrakes,
    workCopy.presetDiagnostics,
    workCopy.presetSuspension,
    workCopy.presetFilters,
  ].filter(Boolean);

  const addPresetWork = (label) => {
    setForm((current) => {
      const existing = current.workItems.map((item) => item.trim()).filter(Boolean);
      if (existing.includes(label)) return current;
      if (current.workItems.length === 1 && !current.workItems[0].trim()) {
        return { ...current, workItems: [label] };
      }
      return { ...current, workItems: [...current.workItems, label] };
    });
  };

  return (
    <div className="work-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="work-modal work-modal-wide service-flow-modal work-modal-clean" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="work-modal-close" aria-label={workCopy.close} onClick={onClose}>×</button>
        <h2>{workCopy.startService}</h2>

        <div className="service-flow-steps" aria-label={workCopy.serviceSteps}>
          {[1, 2, 3].map((number) => (
            <span key={number} className={step === number ? 'active' : step > number ? 'done' : ''}>
              <b>{number}</b>{number === 1 ? workCopy.stepChoose : number === 2 ? workCopy.stepWork : workCopy.stepDetails}
            </span>
          ))}
        </div>

        {step === 1 && (
          <div className="service-flow-page">
            <div className="work-form-section-head">
              <div>
                <strong>{workCopy.chooseTodayBooking}</strong>
                <span>{workCopy.todayWindow}</span>
              </div>
            </div>

            {todayBookings.length === 0 ? (
              <div className="workspace-empty-box"><strong>{workCopy.noTodayBookings}</strong><span>{workCopy.unplannedServiceHint}</span></div>
            ) : (
              <div className="service-booking-picker">
                {todayBookings.map((booking) => (
                  <button type="button" key={booking.id} onClick={() => chooseBooking(booking)}>
                    <time>{booking.time || '-'}</time>
                    <div>
                      <strong>{booking.clientName}</strong>
                      <span>{[getVehicleLabel(booking), booking.plate].filter(Boolean).join(' · ')}</span>
                      <small>{booking.service}</small>
                    </div>
                    <b><ChevronRightIcon size={17} /></b>
                  </button>
                ))}
              </div>
            )}

            <button type="button" className="workspace-secondary-action service-unplanned-btn" onClick={chooseUnplanned}>
              + {workCopy.unplannedService}
            </button>
          </div>
        )}

        {step === 2 && (
          <form className="work-form service-flow-page" onSubmit={(event) => { event.preventDefault(); goToDetails(); }}>
            {form.sourceBookingId && (
              <div className="selected-booking-banner">
                <span>{workCopy.selectedBooking}</span>
                <strong>{form.name} · {[form.carMake, form.carModel, form.plate].filter(Boolean).join(' · ')}</strong>
              </div>
            )}

            {!form.sourceBookingId && (
              <section className="work-form-section client-lookup-section">
                <div className="work-form-section-head compact-client-head">
                  <strong>{workCopy.findClient}</strong>
                </div>
                <div className="client-picker client-picker-compact">
                  <div className="client-picker-search-row">
                    <input
                      type="search"
                      value={clientSearch}
                      onChange={(event) => { setClientSearch(event.target.value); setShowAllClients(false); }}
                      placeholder={workCopy.clientSearchPlaceholder}
                      autoComplete="off"
                    />
                    <button type="button" className={showAllClients ? 'client-picker-list-toggle open' : 'client-picker-list-toggle'} aria-expanded={showAllClients} onClick={() => setShowAllClients((value) => !value)}>
                      <ChevronRightIcon size={20} />
                    </button>
                  </div>
                  {suggestions.length > 0 && (
                    <div className="client-picker-results">
                      {suggestions.map((client) => (
                        <button type="button" key={client.id} onClick={() => chooseClient(client)}>
                          <div><strong>{client.name}</strong><span>{[client.phone, getVehicleLabel(client), client.plate].filter(Boolean).join(' · ')}</span></div>
                          <span className="client-picker-arrow"><ChevronRightIcon size={17} /></span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="work-form-section service-client-compact">
              <div className="work-form-section-title">{workCopy.clientAndVehicle}</div>
              <div className="work-form-grid">
                <label><FieldLabel required>{t.workClientName}</FieldLabel><input value={form.name} onChange={update('name')} readOnly={clientLocked} /></label>
                <label><FieldLabel required>{t.workPhone}</FieldLabel><input value={form.phone} onChange={update('phone')} readOnly={clientLocked} type="tel" /></label>
              </div>
              <div className="work-form-grid vehicle-grid">
                <label><FieldLabel required>{workCopy.carMake}</FieldLabel><input value={form.carMake} onChange={update('carMake')} readOnly={clientLocked} placeholder="Volvo" /></label>
                <label><FieldLabel required>{workCopy.carModel}</FieldLabel><input value={form.carModel} onChange={update('carModel')} readOnly={clientLocked} placeholder="XC60" /></label>
              </div>
              <div className="work-form-grid">
                <label><FieldLabel>{workCopy.variantOptional}</FieldLabel><input value={form.variant} onChange={update('variant')} readOnly={clientLocked} placeholder="B5 AWD" /></label>
                <label><FieldLabel>{t.workPlate}</FieldLabel><input value={form.plate} onChange={update('plate')} readOnly={clientLocked} placeholder="123ABC" /></label>
              </div>
            </section>

            <section className="work-form-section">
              <div className="quick-work-presets">
                <span>{workCopy.quickWorkPresets}</span>
                <div>
                  {quickWorkPresets.map((preset) => (
                    <button type="button" key={preset} onClick={() => addPresetWork(preset)}>+ {preset}</button>
                  ))}
                </div>
              </div>
              <div className="work-items-editor">
                <div className="work-items-editor-head">
                  <span>{workCopy.workItems}<b className="required-mark">*</b></span>
                  <button type="button" className="inline-text-btn" onClick={addWorkItem}>+ {workCopy.addWorkLine}</button>
                </div>
                {form.workItems.map((item, index) => (
                  <div className="work-item-row" key={`service-item-${index}`}>
                    <span className="work-item-number">{index + 1}</span>
                    <input value={item} onChange={(event) => updateWorkItem(index, event.target.value)} placeholder={workCopy.workItemPlaceholder} required={index === 0} />
                    <button type="button" className="work-item-remove" onClick={() => removeWorkItem(index)} disabled={form.workItems.length === 1}>×</button>
                  </div>
                ))}
              </div>
            </section>

            {error && <p className="service-flow-error">{error}</p>}
            <div className="work-form-actions service-flow-actions">
              <button type="button" className="work-secondary-btn" onClick={() => setStep(1)}>{workCopy.back}</button>
              <button type="submit" className="work-primary-btn">{workCopy.next}</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="work-form service-flow-page" onSubmit={save}>
            <section className="work-form-section">
              <div className="work-form-section-title">{workCopy.serviceDetails}</div>
              <div className="work-form-grid">
                <label><FieldLabel required>{t.workDate}</FieldLabel><input type="date" value={form.date} onChange={update('date')} required /></label>
                <label><FieldLabel>{workCopy.mileageOptional}</FieldLabel><input value={form.mileage} onChange={update('mileage')} inputMode="numeric" placeholder="120000 km" /></label>
              </div>
              <label><FieldLabel>{workCopy.materialsOptional}</FieldLabel><textarea value={form.materials} onChange={update('materials')} rows="3" placeholder={workCopy.materialsPlaceholder} /></label>
              <label><FieldLabel>{workCopy.notesOptional}</FieldLabel><textarea value={form.notes} onChange={update('notes')} rows="3" placeholder={workCopy.notesPlaceholder} /></label>
              <div className="next-service-block">
                <div className="work-form-section-title">{workCopy.nextService}</div>
                <div className="work-form-grid">
                  <label><FieldLabel>{workCopy.nextServiceMonths}</FieldLabel><input type="number" min="1" max="60" value={form.nextServiceMonths} onChange={update('nextServiceMonths')} placeholder="8" /></label>
                  <label><FieldLabel>{workCopy.nextServiceNote}</FieldLabel><input value={form.nextServiceNote} onChange={update('nextServiceNote')} placeholder={workCopy.nextServiceNotePlaceholder} /></label>
                </div>
                <p className="form-field-hint">{workCopy.nextServiceMonthsHint}</p>
              </div>
            </section>

            <div className="service-summary-card">
              <div><span>{workCopy.clientAndVehicle}</span><strong>{form.name} · {[form.carMake, form.carModel, form.plate].filter(Boolean).join(' · ')}</strong></div>
              <div><span>{workCopy.workItems}</span><strong>{form.workItems.join(' · ')}</strong></div>
            </div>

            <div className="work-form-actions service-flow-actions">
              <button type="button" className="work-secondary-btn" onClick={() => setStep(2)}>{workCopy.back}</button>
              <button type="submit" className="work-primary-btn">{workCopy.saveServiceRecord}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
