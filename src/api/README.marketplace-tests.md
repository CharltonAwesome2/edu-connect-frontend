# Marketplace API Tests

This folder includes unit tests for the Tutor Marketplace facade in `marketplace.js`.

## Covered Behavior

- `marketplace.directory` loads tutor directory data and applies subject/rate filters.
- `marketplace.tutorDetails` aggregates profile, subjects, availability, and reviews.
- `marketplace.createBookingRequest` applies booking defaults and forwards payloads.

## Run

```powershell
npm run test:run -- src/api/marketplace.test.js
```

