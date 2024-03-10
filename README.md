# Next.js + Shadcn UI + Auth.js Template

This is a repository for Next.js Template with Shadcn UI and Auth.js v5.

Key Features:

- 🚀 Next.js 14
- 🔐 Auth.js v5
- 🌐 Social Login (Google/GitHub)
- ✉️ Email Verification
- 🔒 Forgot Password
- 📱 Two Factor Verification
- 👥 User Roles (Admin/User)
- 🔓 Login/Register/Logout Button (Redirect/Modal)
- 🚧 Role Gate (Render Content only for Admin)
- ⚠️ Success & Error Component
- 👤 useCurrentUser/useCurrentRole hooks for Client Component
- 🧑 getCurrentUser getCurrentRole functions for Server Component
- 🖥️ Example with Server & Client component
- 🛡️ Example Protect API Routes & Server Actions for Admins Only
- 🔑 Example of changing Email with Verification, Password with Old Password, & User Role & Enable/disable Two Factor Auth

### Clone Repository

```shell
git clone https://github.com/shayan-workspace/next-template.git
```

### Install Dependencies

```shell
npm i
```

### Setup .env File

```shell
DATABASE_URL=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=
```

### Setup Prisma

```shell
npx prisma generate
npx prisma db push
```

### Start Development Server

```shell
npm run dev
```

## Available Commands

Running commands with npm `npm run [command]`

| Command | Description               |
| :------ | :------------------------ |
| `dev`   | Starts Development Server |
| `build` | Optimize Production App   |
| `start` | Starts App                |
| `lint`  | Lint Code                 |
