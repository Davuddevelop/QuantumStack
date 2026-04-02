# Firebase Integration & Configuration

This document describes the Firebase integration for QuantumStack, including its configuration and security rules.

## Firebase Configuration

The backend uses Firebase Admin SDK for interacting with Firebase services.

### Environment Variables
Configure the following in your `.env` file:
- `FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email.
- `FIREBASE_PRIVATE_KEY`: Your Firebase service account private key (with `\n` characters).

### Backend Implementation
The `CommunityService` handles data operations via Firebase Admin.

## Security Rules

### Firestore Security Rules
Currently, Firestore rules are configured to ensure that only authenticated users can access their own data.

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /communities/{communityId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Authentication
Firebase Auth is used for user authentication and authorization.

## Data Schema

### Communities Collection
- `name`: String
- `description`: String
- `membersCount`: Number
- `lastActive`: Timestamp

### Members Collection
- `name`: String
- `interests`: Array<String>
- `communityId`: String
- `email`: String (optional)
