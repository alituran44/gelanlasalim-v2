export const API_BASE_URL = "http://localhost:8000/api"

interface ApiOptions extends RequestInit {
  token?: string
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.token && {
      Authorization: `Bearer ${options.token}`
    }),
    ...options.headers
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json() as Promise<T>
}