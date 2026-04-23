# Deployment Guide: writespace

This document describes how to deploy the **writespace** app (Vite + React) to production, with a focus on Vercel configuration, environment variables, SPA routing, and important caveats.

---

## 1. Build & Output

- **Build command:**  
  ```
  npm run build
  ```
- **Output directory:**  
  ```
  dist
  ```
- Vercel auto-detects Vite and uses these defaults.

---

## 2. Vercel Configuration

### Basic Setup

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (default)

### SPA Routing (History Fallback)

Vite apps are Single Page Applications (SPA). To ensure client-side routing works (e.g., `/dashboard`, `/profile`), configure Vercel to serve `index.html` for all routes.

**Add a `vercel.json` file at the project root:**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures all non-static routes fallback to `index.html`, allowing React Router to handle navigation.

---

## 3. Environment Variables

- All environment variables must be prefixed with `VITE_` to be exposed to the client.
- Example:  
  ```
  VITE_API_URL=https://api.example.com
  ```
- Set these in Vercel's **Project Settings > Environment Variables**.

**Access in code:**  
```js
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 4. Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket.**
2. **Import the repo into Vercel.**
3. **Set environment variables in Vercel dashboard.**
4. **Deploy.**

Vercel will:
- Install dependencies
- Run the build
- Serve the static files from `/dist`

---

## 5. Caveats & Notes

- **No server-side rendering:** This is a static SPA. All rendering is client-side.
- **API routes:** If you need serverless functions, add them in `/api` (Vercel Functions).
- **404s:** With the `vercel.json` rewrite, all unknown routes will load your SPA. Handle 404s in React Router.
- **Custom domains:** Add and configure in Vercel dashboard.
- **Preview deployments:** Each PR gets a unique preview URL.

---

## 6. Local Testing

To test the production build locally:

```bash
npm run build
npx serve dist
```

---

## 7. Troubleshooting

- **Blank page on refresh:**  
  Make sure the `vercel.json` rewrite is present.
- **Env vars not available:**  
  All client-exposed env vars must start with `VITE_`.

---

For more, see [Vercel docs](https://vercel.com/docs) and [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html).