# Class Fund Web Application

A web application for managing class funds (income and expenses) built with Next.js, Prisma, Tailwind CSS, and SQLite.

## Local Development

If you have Node.js installed, you can run the following commands:

```bash
# Install dependencies
npm install

# Initialize Prisma SQLite database
npx prisma db push
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment Guide (GitHub & Vercel)

Follow these steps to deploy your application to Vercel.

### 1. Push to GitHub

1. Open your terminal in the `class-fund-app` folder.
2. Initialize a git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Go to GitHub and create a new repository.
4. Link your local repository to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`class-fund-app`).
4. In the **Configure Project** section:
   - Expand **Environment Variables**
   - Vercel uses a serverless environment, so SQLite (which writes to local files) won't persist data between requests.
   - For production, you should use **Vercel Postgres**.
5. Click **Deploy**.

#### Switching to Vercel Postgres (For Production)

To make your database work on Vercel, you should migrate from SQLite to PostgreSQL:

1. In your Vercel project dashboard, go to the **Storage** tab and create a **Postgres** database.
2. Connect it to your project. This will automatically add `POSTGRES_URL` to your Vercel Environment Variables.
3. Update your `prisma/schema.prisma` locally:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL")
   }
   ```
4. Update `.env` (locally) with the `POSTGRES_URL` provided by Vercel for local testing.
5. Push your changes to GitHub. Vercel will auto-deploy.
6. Run the database migration on Vercel by going to the Vercel Postgres dashboard and executing your queries, or add a `postinstall` script to `package.json`: `"postinstall": "prisma generate && prisma db push"`
