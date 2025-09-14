# Vercel Deployment Guide

This guide provides instructions for deploying the Erad Trading Copilot frontend to Vercel and configuring the necessary environment variables.

## 1. Project Setup in Vercel

1.  **Import Project**: Import your Git repository (`https://github.com/AlterSupport/erad-trading-copilot-staging.git`) into Vercel.
2.  **Framework Preset**: Vercel should automatically detect that this is a Next.js project.
3.  **Root Directory**: Ensure the root directory is set to the default (`./`).

## 2. Environment Variables

This is the most critical step. You need to add the following environment variables to your Vercel project settings:

-   **`NEXT_PUBLIC_LLM_SERVICE_URL`**: This is the URL of your deployed Google Cloud Function.
    -   **Value**: `https://erad-trading-llm-service-4j5sq4ttmq-uc.a.run.app`

### How to Add Environment Variables in Vercel:

1.  Go to your project's dashboard on Vercel.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Environment Variables**.
4.  Add a new variable:
    -   **Name**: `NEXT_PUBLIC_LLM_SERVICE_URL`
    -   **Value**: `https://erad-trading-llm-service-4j5sq4ttmq-uc.a.run.app`
5.  Save the variable.

## 3. Redeploy

After adding the environment variable, you will need to trigger a new deployment in Vercel for the changes to take effect. You can do this from the **Deployments** tab in your Vercel project.

## 4. Troubleshooting

-   **`ERR_CONNECTION_REFUSED`**: This error indicates that the `NEXT_PUBLIC_LLM_SERVICE_URL` is missing or incorrect in your Vercel project. Double-check the value and make sure you have redeployed.
-   **CORS Errors**: If you encounter CORS errors, ensure that the Vercel deployment URL (`https://erad-trading-copilot-staging.vercel.app`) is included in the `CORS` configuration in your `cloud-function/main.py` file and that the cloud function has been redeployed with the changes.

By following these steps, your Vercel deployment will be correctly configured to communicate with the deployed agentic AI backend.
