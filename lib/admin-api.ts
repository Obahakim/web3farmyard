const API_BASE = '/api-proxy.php'

let csrfToken: string | null = null

export function setAdminCsrfToken(token: string | null) {
  csrfToken = token
}

async function request<T>(action: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (options.method && options.method.toUpperCase() !== 'GET') {
    if (!csrfToken) throw new Error('Your admin session has expired. Sign in again.')
    headers.set('X-W3F-CSRF', csrfToken)
  }

  const response = await fetch(`${API_BASE}?action=${action}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) {
      setAdminCsrfToken(null)
      throw new Error('Your admin session has expired. Sign in again.')
    }
    throw new Error(payload.error || `Request failed (${response.status})`)
  }
  return payload as T
}

export function adminGet<T>(table: string, limit = 200): Promise<T> {
  return request<T>(`admin-data&table=${encodeURIComponent(table)}&limit=${limit}`)
}

export function adminPost<T>(table: string, body: unknown): Promise<T> {
  return request<T>(`admin-data&table=${encodeURIComponent(table)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function adminPatch<T>(table: string, id: string, body: unknown): Promise<T> {
  return request<T>(`admin-data&table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function adminDelete<T>(table: string, id: string): Promise<T> {
  return request<T>(`admin-data&table=${encodeURIComponent(table)}&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export function adminSendNewsletter<T>(body: { subject: string; content: string; topic: string }): Promise<T> {
  return request<T>('admin-newsletter', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
