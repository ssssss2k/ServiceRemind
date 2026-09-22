import { DEFAULT_ORGANIZATION_ID } from '../auth/authConfig';
import { addDaysToKey, localDateKey } from '../utils/dateUtils';

const CLIENTS = [
  ['CL001', 'Ivan Petrov', '+372 5888 1234', 'Volvo', 'S60', 'D4', '777YYY'],
  ['CL002', 'Maksim Lebedev', '+372 5855 0123', 'Mercedes-Benz', 'C43 AMG', '4MATIC', '444SSS'],
  ['CL003', 'Oleg Smirnov', '+372 5855 0234', 'Audi', 'A6 Allroad', '3.0 TDI', 'TEO999'],
  ['CL004', 'Sergei Ivanov', '+372 5667 4112', 'BMW', '530d', 'xDrive', '545JJJ'],
  ['CL005', 'Kristjan Tamm', '+372 5123 8070', 'Škoda', 'Octavia', '1.5 TSI', '321ABC'],
  ['CL006', 'Anna Petrova', '+372 5559 1200', 'Toyota', 'RAV4', 'Hybrid', '909KLM'],
  ['CL007', 'Mart Saar', '+372 5200 4411', 'Volkswagen', 'Passat', '2.0 TDI', '618MNP'],
  ['CL008', 'Roman Kuznetsov', '+372 5699 3377', 'Ford', 'Transit Custom', '2.0 EcoBlue', '221TRK'],
  ['CL009', 'Liis Kask', '+372 5134 7700', 'Kia', 'Sportage', '1.6 T-GDI', '857KIA'],
  ['CL010', 'Viktor Orlov', '+372 5622 9941', 'Volvo', 'XC60', 'B5 AWD', '123ABC'],
  ['CL011', 'Andrei Morozov', '+372 5866 1830', 'Peugeot', '3008', '1.5 BlueHDi', '662PEU'],
  ['CL012', 'Jaanus Pärn', '+372 5112 2388', 'Renault', 'Trafic', '2.0 dCi', '711VAN'],
];

const SERVICES = [
  'Замена масла и фильтров',
  'Проверка тормозов и замена передних колодок',
  'Диагностика подвески',
  'Замена и балансировка шин',
  'Обслуживание кондиционера',
  'Диагностика двигателя',
  'Проверка аккумулятора и зарядки',
  'Плановое ТО по регламенту',
  'Проверка рулевого управления',
  'Диагностика утечки охлаждающей жидкости',
];

const MATERIALS = ['5W-30, MANN filter', 'ATE klotsid', 'Michelin Pilot Sport', 'Bosch filter', 'OEM tihendikomplekt', 'Castrol EDGE'];

function isoAt(key, hour = 9) {
  return `${key}T${String(hour).padStart(2, '0')}:15:00.000Z`;
}

export function buildDemoWorkSeed(accounts = []) {
  const today = localDateKey();
  const owner = accounts.find((account) => account.id === 'SR7A2QX');
  const mechanics = ['SR4M9KP', 'SR6K2MV', 'SR8R5TN']
    .map((id) => accounts.find((account) => account.id === id))
    .filter(Boolean);
  const allWorkers = [owner, ...mechanics].filter(Boolean);

  const clients = CLIENTS.map(([id, name, phone, carMake, carModel, variant, plate], index) => ({
    id,
    organizationId: DEFAULT_ORGANIZATION_ID,
    name,
    phone,
    carMake,
    carModel,
    variant,
    plate,
    addedByUserId: owner?.id || 'SR7A2QX',
    addedByEmail: owner?.email || 'owner@serviceremind.ee',
    addedByRole: 'owner',
    createdAt: isoAt(addDaysToKey(today, -(22 - index)), 8),
    updatedAt: isoAt(addDaysToKey(today, -Math.max(1, 8 - index)), 13),
  }));

  const bookingBlueprint = [
    [0, '08:30', 0, 0], [0, '10:00', 1, 1], [0, '11:30', 2, 2], [0, '14:00', 3, 0], [0, '16:00', 4, 1],
    [1, '09:00', 5, 2], [1, '10:30', 6, 0], [1, '13:00', 7, 1], [1, '15:30', 8, 2],
    [2, '08:00', 9, 0], [2, '10:00', 10, 1], [2, '12:30', 11, 2], [2, '15:00', 0, 0],
    [3, '09:15', 1, 1], [3, '11:00', 2, 2], [3, '14:30', 3, 0],
    [4, '08:30', 4, 1], [4, '10:30', 5, 2], [4, '13:30', 6, 0], [4, '16:00', 7, 1],
    [6, '09:00', 8, 2], [6, '11:30', 9, 0], [6, '14:00', 10, 1],
    [7, '08:45', 11, 2], [7, '10:45', 0, 0], [7, '13:15', 1, 1],
    [9, '09:30', 2, 2], [9, '12:00', 3, 0], [9, '15:00', 4, 1],
    [11, '08:30', 5, 2], [11, '11:00', 6, 0], [11, '14:30', 7, 1],
    [13, '09:00', 8, 2], [13, '11:00', 9, 0], [13, '14:00', 10, 1],
  ];

  const bookings = bookingBlueprint.map(([dayOffset, time, clientIndex, mechanicIndex], index) => {
    const client = clients[clientIndex];
    const mechanic = mechanics[mechanicIndex] || owner;
    const date = addDaysToKey(today, dayOffset);
    return {
      id: `BK${String(index + 1).padStart(3, '0')}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      carMake: client.carMake,
      carModel: client.carModel,
      variant: client.variant,
      plate: client.plate,
      service: SERVICES[index % SERVICES.length],
      notes: index % 4 === 0 ? 'Клиент просил согласовать дополнительные работы по телефону.' : '',
      date,
      time,
      assignedUserId: mechanic?.id || '',
      assignedMechanicId: mechanic?.id || '',
      assignedMechanicEmail: mechanic?.email || '',
      assignedMechanicName: mechanic?.name || '',
      createdByUserId: owner?.id || 'SR7A2QX',
      createdByEmail: owner?.email || 'owner@serviceremind.ee',
      status: 'scheduled',
      createdAt: isoAt(addDaysToKey(today, -5), 10),
      updatedAt: isoAt(addDaysToKey(today, -2), 11),
    };
  });

  const completedJobs = Array.from({ length: 24 }, (_, index) => {
    const client = clients[index % clients.length];
    const mechanic = mechanics[index % mechanics.length] || owner;
    const dayOffset = -(1 + (index % 18));
    const date = addDaysToKey(today, dayOffset);
    const service = SERVICES[(index + 2) % SERVICES.length];
    return {
      id: `JOB${String(index + 1).padStart(3, '0')}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      carMake: client.carMake,
      carModel: client.carModel,
      variant: client.variant,
      plate: client.plate,
      workItems: [service, index % 3 === 0 ? 'Общий технический осмотр' : 'Контроль после выполненных работ'],
      service,
      materials: MATERIALS[index % MATERIALS.length],
      mileage: String(84500 + index * 2150),
      notes: index % 4 === 0 ? 'Рекомендация: на следующем ТО проверить состояние тормозов.' : '',
      date,
      mechanicId: mechanic?.id || '',
      mechanicEmail: mechanic?.email || '',
      mechanicName: mechanic?.name || '',
      nextServiceMonths: index % 2 === 0 ? '8' : '',
      nextServiceNote: index % 2 === 0 ? 'Следующее плановое обслуживание' : '',
      nextServiceDueDate: '',
      createdAt: isoAt(date, 15),
      updatedAt: isoAt(date, 15),
    };
  });

  const reminders = completedJobs
    .filter((job) => job.nextServiceMonths)
    .map((job, index) => ({
      id: `REM${String(index + 1).padStart(3, '0')}`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      sourceJobId: job.id,
      clientId: job.clientId,
      dueDate: addDaysToKey(today, 90 + index * 14),
      note: job.nextServiceNote,
      status: 'scheduled',
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));

  const resourceLinks = allWorkers.flatMap((worker, workerIndex) => worker ? [
    {
      id: `LINK-${worker.id}-1`,
      organizationId: DEFAULT_ORGANIZATION_ID,
      title: workerIndex === 0 ? 'Inter Cars' : 'Trodo',
      url: workerIndex === 0 ? 'https://intercars.ee/' : 'https://www.trodo.ee/',
      userId: worker.id,
      userEmail: worker.email,
      sortOrder: 0,
      createdAt: isoAt(addDaysToKey(today, -20), 10),
      updatedAt: isoAt(addDaysToKey(today, -20), 10),
    },
  ] : []);

  const activityLog = completedJobs.slice(0, 18).map((job, index) => ({
    id: `ACT${String(index + 1).padStart(3, '0')}`,
    organizationId: DEFAULT_ORGANIZATION_ID,
    actorUserId: job.mechanicId,
    actorEmail: job.mechanicEmail,
    actorName: job.mechanicName,
    actorRole: 'mechanic',
    action: 'service_completed',
    actionLabel: 'Service completed',
    targetType: 'service',
    targetId: job.id,
    targetLabel: `${job.clientName} · ${job.plate}`,
    details: job.service,
    createdAt: job.createdAt,
  }));

  return { clients, bookings, reminders, completedJobs, resourceLinks, activityLog };
}

export function mergeDemoSeed(store, seed) {
  const mergeById = (current = [], incoming = []) => {
    const existing = new Set(current.map((item) => item.id));
    return [...current, ...incoming.filter((item) => !existing.has(item.id))];
  };

  return {
    clients: mergeById(store.clients, seed.clients),
    bookings: mergeById(store.bookings, seed.bookings),
    reminders: mergeById(store.reminders, seed.reminders),
    completedJobs: mergeById(store.completedJobs, seed.completedJobs),
    resourceLinks: mergeById(store.resourceLinks, seed.resourceLinks),
    activityLog: mergeById(store.activityLog, seed.activityLog),
  };
}
