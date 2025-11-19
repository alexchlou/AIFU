---
description: Deploy the application to Vercel
---

This workflow will guide you through deploying your application to Vercel, which is a popular platform for hosting frontend applications.

1.  **Build the application**
    Ensure your application builds correctly.
    ```bash
    npm run build
    ```

2.  **Deploy using Vercel CLI**
    We will use `npx` to run the Vercel CLI without installing it globally.
    
    Run the following command and follow the interactive prompts:
    -   **Set up and deploy?**: `y`
    -   **Which scope?**: Select your account (or create one if prompted)
    -   **Link to existing project?**: `n` (unless you already created one)
    -   **Project name**: Press Enter to accept default or type a name (e.g., `aifu-case-tracker`)
    -   **In which directory is your code located?**: `./` (Press Enter)
    -   **Want to modify these settings?**: `n` (Auto-detected settings for Vite are usually correct)
    
    ```bash
    npx vercel
    ```

3.  **Production Deployment**
    The previous step creates a "Preview" deployment. To deploy to production (your main URL):
    ```bash
    npx vercel --prod
    ```

4.  **Visit your site**
    The command output will provide you with a URL (e.g., `https://aifu-case-tracker.vercel.app`). Click it to see your live application!
