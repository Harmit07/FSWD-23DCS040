Firebase Hosting + Functions setup for this project

What I added
- `firebase.json` — Hosting config that serves `task18-f/dist` and rewrites `/api/**` to the `api` Cloud Function.
- `.firebaserc` — placeholder for your Firebase project id (replace `your-firebase-project-id`).
- `functions/` — a Cloud Functions app that exposes your Express routes as `api` and connects to MongoDB using functions config.

Quick deploy steps

1. Install Firebase CLI (if not installed):

   npm install -g firebase-tools

2. Login and select project:

   firebase login
   firebase use --add

3. Set Mongo URI in Firebase functions config (replace with your URI):

   firebase functions:config:set mongo.uri="<YOUR_MONGO_URI>"

4. Install dependencies

   # backend functions deps
   cd functions && npm install

   # frontend deps and build
   cd ../task18-f && npm install && npm run build

5. Deploy (from project root):

   firebase deploy --only hosting,functions

Notes
- The Cloud Function reads the Mongo URI from `functions.config().mongo.uri`. You can also set MONGO_URI in environment for local testing.
- For local testing use the Firebase emulator: `firebase emulators:start --only hosting,functions` from project root.
