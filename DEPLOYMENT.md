# Public Website Deployment

This app is a static Vite React website. After `npm run build`, the production website is in `dist/` and can be hosted by Vercel, Netlify, Firebase Hosting, GitHub Pages, or any static web server.

## Vercel

```powershell
npm install
npm run build
npx vercel --prod
```

Vercel settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Netlify

```powershell
npm install
npm run build
npx netlify deploy --prod --dir=dist
```

## Firebase Hosting

```powershell
npm install
npm run build
npx firebase login
npx firebase init hosting
npx firebase deploy
```

Keep `firebase.json` configured to publish `dist`.

## Firebase App Keys

Use `.env.example` as a template. The website currently runs without Firebase keys because the AI demo logic is local. Add Firebase integration later by creating a `.env` file and connecting the same collections used in the Android app.
