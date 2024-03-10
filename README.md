# Next.js + Prisma + Auth.js + Shadcn Template

Opiniated Next.js Template with Prisma, Auth.js v5 and Shadcn.

- 🚀 Next.js 14
- 🔐 Auth.js v5
- 🌐 Social Login (GitHub/Google)
- ✉️ Email Verification
- 🔒 Forgot Password
- 📱 Two Factor Authentication
- 👥 Roles (Admin/User)
- 🔓 Login/Register/Logout Button (Redirect/Modal)
- 🚧 Role Gate (Render Content only for Specific Roles)
- ⚠️ Success & Error Component
- 👤 useCurrentUser/useCurrentRole hooks for Client Component
- 🧑 getCurrentUser getCurrentRole functions for Server Component
- 🖥️ Example with Server & Client component
- 🛡️ Example of API Routes & Server Actions for Admins Only
- 🔑 Example of changing Email with Verification, Password with Old Password, & User Role & Enable/disable Two Factor Auth

### Limitation

- Until you register a Domain in Resend Dashboard, Emails will only be send to your Resend Developer Account.

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
