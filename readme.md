# Welcome to `with-auth-api`!

This is an API to provide an authentication backend for your application. It runs with mysql and nodejs, using Twilio for verifications.

## Getting Started

First, fill out an env file:

```env
NAMESPACE=WithAuth
DB_HOST=db url
DB_USER=db username
DB_PASS=db password
DB_NAME=database name # Recommend (not required) using the same as NAMESPACE
STRIPE_PK=stripe publishable key
STRIPE_SK=stripe secret key
TWILIO_SID=twilio account sid
TWILIO_AUTH_TOKEN=twilio auth token
TWILIO_PHONE_NUMBER=your twilio phone number (from)
SENDGRID_API_KEY=your sendgrid api key
```

Run the protection script with

```
npm run protect
```

We are looking for the `Environment variables are set` row to be green. Otherwise the protect script should let you know what variables you are missing.

If you see `MySQL connection failed` that may be because you entered the wrong credentials or because you have not yet run Onboarding:

```
npm run onboard
```
