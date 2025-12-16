import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

interface ApiResponse {
  success: boolean
  user: {
    id: string
    name: string
    email: string
  }
  metadata: {
    processed: boolean
    timestamp: string
  }
  tracing: {
    message: string
    spans: string[]
  }
}

function getInstrumentedData(userId?: string) {
  const url = userId
    ? `/demo/api/instrumented?userId=${userId}`
    : '/demo/api/instrumented'
  return fetch(url).then((res) => res.json() as Promise<ApiResponse>)
}

export const Route = createFileRoute('/demo/start/instrumented')({
  component: InstrumentedDemo,
})

function InstrumentedDemo() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('1')

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await getInstrumentedData(userId)
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 text-white"
      style={{
        backgroundColor: '#0a0a1a',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, #3b2667 0%, #1a0a2e 50%, #0a0a1a 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl border border-purple-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <h1 className="text-2xl font-semibold tracking-tight">
            OpenTelemetry Instrumented API
          </h1>
        </div>

        <p className="text-gray-400 mb-6 text-sm">
          This demo showcases an API endpoint with custom OpenTelemetry spans for
          tracing requests, database operations, and data processing.
        </p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>

        {data && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h2 className="text-sm font-medium text-purple-400 mb-3">
                User Data
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-400">ID:</span>
                <span className="text-white font-mono">{data.user.id}</span>
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{data.user.name}</span>
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{data.user.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h2 className="text-sm font-medium text-purple-400 mb-3">
                Processing Metadata
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-400">Processed:</span>
                <span className="text-green-400">
                  {data.metadata.processed ? '✓ Yes' : '✗ No'}
                </span>
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white font-mono text-xs">
                  {data.metadata.timestamp}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
              <h2 className="text-sm font-medium text-purple-400 mb-3">
                Tracing Info
              </h2>
              <p className="text-gray-300 text-sm mb-3">{data.tracing.message}</p>
              <div className="flex flex-wrap gap-2">
                {data.tracing.spans.map((span) => (
                  <span
                    key={span}
                    className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono"
                  >
                    {span}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

