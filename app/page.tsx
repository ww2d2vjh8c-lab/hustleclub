import { requireUser } from '@/lib/auth'

export default async function DashboardPage() {
  // 🔒 AUTH GATE (SERVER SIDE)
  const user = await requireUser()

  return (
    <main style={{ padding: '24px' }}>
      <h1>Dashboard</h1>

      <p>Welcome back 👋</p>

      <pre
        style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f3f4f6',
          borderRadius: '6px',
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
    </main>
  )
}
