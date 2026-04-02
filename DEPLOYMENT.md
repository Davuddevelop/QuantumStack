# QuantumStack Deployment

This document describes the deployment procedures for QuantumStack.

## Frontend (Vercel)

The frontend is designed for seamless deployment on [Vercel](https://vercel.com/).

### Deployment Steps
1. Push your code to a GitHub repository.
2. Link your repository in the Vercel dashboard.
3. Vercel will automatically detect the build settings and deploy.

### Environment Variables
Configure the following in the Vercel dashboard:
- `REACT_APP_API_URL`: The URL of your backend API.

## Backend (Firebase/Express)

The backend is an Express.js application which can be deployed to several services, including Firebase Functions, Vercel, or Google Cloud.

To deploy on Vercel:
1. Ensure your `vercel.json` is correctly configured (see the root of the repository).
2. Configure the following in the Vercel dashboard:
    - `OPENAI_API_KEY`: Your OpenAI API key.
    - `FIREBASE_PROJECT_ID`: Your Firebase project ID.
    - `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email.
    - `FIREBASE_PRIVATE_KEY`: Your Firebase service account private key.

### Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    }
  ]
}
```

## Monitoring & Logging
- **Vercel Logs**: Use the Vercel dashboard for real-time logs and debugging.
- **Winston/Logger**: The backend uses [Winston](https://github.com/winstonjs/winston) for structured logging to the console.
