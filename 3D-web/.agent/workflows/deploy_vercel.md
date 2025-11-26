---
description: Deploy the 3D-web application to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying your Vite + React application to Vercel.

## Prerequisites

- A Vercel account (https://vercel.com/signup)
- Node.js installed (which you have)

## Method 1: Quick Deployment via CLI (Recommended for testing)

1.  **Login to Vercel**
    Run the following command to log in to your Vercel account via the terminal.
    ```powershell
    npx vercel login
    ```

2.  **Deploy**
    Run the deploy command from the project root.
    ```powershell
    npx vercel
    ```
    - Set up and deploy? **Y**
    - Which scope? (Select your account)
    - Link to existing project? **N**
    - Project name? (Press Enter for default or type a name like `neurafab-3d`)
    - In which directory is your code located? **./** (Press Enter)
    - Want to modify these settings? **N** (Auto-detect is usually correct for Vite)

3.  **Set Environment Variables**
    Your application needs the `API_KEY` to function.
    
    **Option A: Via Vercel Dashboard (Easiest)**
    - Go to the URL provided in the terminal (Production: https://...).
    - Go to **Settings** -> **Environment Variables**.
    - Add a new variable:
      - Key: `GEMINI_API_KEY` (or `API_KEY` depending on your .env)
      - Value: (Paste your actual API key from .env)
    - **Redeploy**: After saving, you usually need to redeploy for changes to take effect. You can do this by running `npx vercel --prod` in your terminal.

    **Option B: Via CLI**
    ```powershell
    npx vercel env add GEMINI_API_KEY
    ```
    - Paste your key when prompted.
    - Select environments: Production, Preview, Development.
    - Redeploy: `npx vercel --prod`

## Method 2: Git Integration (Recommended for production)

1.  **Initialize Git**
    ```powershell
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Push to GitHub/GitLab**
    - Create a new repository on GitHub.
    - Follow the instructions to push your local code to the remote repository.

3.  **Import in Vercel**
    - Go to https://vercel.com/new
    - Select your Git provider and import the repository.
    - In the **Environment Variables** section, add your `GEMINI_API_KEY`.
    - Click **Deploy**.

## Troubleshooting

- **Build Fails?** Check the logs in Vercel. Ensure `npm run build` works locally.
- **AI Not Working?** Double-check your Environment Variables. The app needs the API key to talk to SiliconFlow.
