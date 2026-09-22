# ServiceRemind — production roadmap

## 1. Stop expanding localStorage before real customer data

The 8.5 UI is a product prototype. The next major milestone should replace the local identity/data adapters rather than add more browser-only business logic.

## 2. Supabase data model

Start with these entities:

- `organizations`
- `profiles`
- `organization_members`
- `clients`
- `vehicles`
- `bookings`
- `service_records`
- `service_record_items`
- `service_reminders`
- `resource_links`
- `audit_log`

Every business row must be scoped by `organization_id`. Use stable UUIDs for users and organizations; email is a login/contact field, never a foreign key.

## 3. Permissions

Implement Row Level Security before importing real customer data.

Owner:
- read/write data inside their organization;
- invite/deactivate mechanics;
- edit customer master data;
- edit service records;
- view audit history.

Mechanic:
- only their own schedule;
- read customer/service history needed for assigned work;
- create customers and bookings;
- no customer-master edits/deletes;
- edit their own service record for 24 hours.

ServiceRemind admin:
- create/deactivate organizations;
- never rely on client-side role checks for privileged access.

## 4. Authentication

Replace demo passwords with Supabase Auth. Add:

- password reset;
- email verification;
- invite flow for mechanics;
- session refresh;
- optional forced sign-out for shared workshop PCs.

## 5. Audit and deletion

Important records should use soft deletion. Record who changed what and when. For sensitive edits, store enough information to investigate/recover mistakes.

## 6. Reminder engine

Do not send reminders from React. Store reminder jobs in PostgreSQL and execute them server-side using a scheduled worker/Edge Function. A change to a service record should update the linked unsent reminder; already-sent messages remain immutable history.

## 7. Production quality

Before pilots:

- automated tests for permissions and critical workflows;
- error monitoring;
- database backups;
- export of a service's data;
- privacy/retention policy;
- rate limits and input validation;
- staging environment separate from production.

## 8. Pilot sequence

1. One internal/demo organization.
2. One friendly workshop with synthetic data.
3. One real pilot with a written data-processing/privacy setup.
4. Observe the owner and mechanic using the product without coaching.
5. Fix repeated friction before adding major features.
6. Expand to 3–5 Estonian workshops, then validate localization/workflows for Latvia and Lithuania.
