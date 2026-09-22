# ServiceRemind 8.9

Vite + React prototype for ServiceRemind, an organization-scoped workspace for auto-service owners and mechanics.

## Demo service

**Baltic Garage OÜ** is prefilled with customers, upcoming bookings, completed jobs, activity history and personal workspace links so the product can be tested with realistic volume.

### Demo accounts

- Owner: `owner@serviceremind.ee` / `1111`
- Mechanic: Peeter Tamm: `meh@serviceremind.ee` / `1111`
- Mechanic: Maksim Orlov: `maksim@serviceremind.ee` / `1111`
- Mechanic: Karl Rosenberg: `karl@serviceremind.ee` / `1111`
- ServiceRemind Admin: `admin@serviceremind.ee` / `1111`


## 8.9 cleanup

- The public workflow section is light again, while the fixed-size interactive demo remains dark and no longer changes dimensions between steps.
- Audience cards return to a white section with a restrained hover treatment.
- Pilot calls-to-action open the lead form directly without scrolling the page.
- The lead form is a wider, clean request form with required name/email/message fields and optional organization/phone fields.
- Pricing card dimensions are preserved; future-plan buttons are visibly disabled and non-interactive.
- The footer pilot button is active again and opens the request form.
- Workspace modals, profile settings, feedback and logout confirmations use solid surfaces instead of translucent panels.
- Completed-work rows use white editable fields with clearer boundaries.
- Workspace footer keeps the feedback button aligned to the right of the ServiceRemind wordmark.
- Problem-description examples no longer use the 90 km/h phrasing.

## Run

```bash
npm install
npm run dev
```

## Current architecture

The UI is split into organization-scoped workspaces:

- ServiceRemind Admin creates/deactivates service organizations and can open each organization to inspect its Owner and mechanics.
- An Owner manages the service, adds/deactivates mechanics, manages client data, schedules and audit history.
- A Mechanic sees only their own schedule, can create a new client, create/edit their own bookings, complete service work and edit their own completed work for 24 hours.
- Completed work and future service reminders remain linked so a backend can later reschedule pending reminders after permitted edits.
- Personal Workspace links belong to an individual account, not the whole organization.

Identity relationships use stable `userId` / `organizationId` values rather than email addresses.

## UI direction

The public site keeps the original ServiceRemind visual identity but uses sentence-case navigation, a compact account entry and a tighter square footer. Workspace controls use one consistent segmented rail, opaque light surfaces and one form style across modals, calendars and profile settings.

## Important security note

This is still a frontend prototype. Demo credentials and business data are stored in `localStorage` and are therefore inspectable/modifiable through browser developer tools. Do not use real customer data in this build.

Before production, replace the local adapters with Supabase Auth + PostgreSQL + Row Level Security and move scheduled reminders to a trusted server-side job.
