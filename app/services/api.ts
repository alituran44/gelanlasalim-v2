interface ApiOptions extends RequestInit {
  token?: string
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.token && {
      Authorization: `Bearer ${options.token}`
    }),
    ...options.headers
  }

  try {
    const response = await $fetch<T>(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers,
      method: options.method as any
    })
    return response
  } catch (error: any) {
    throw new Error(`API Error: ${error.statusCode || error.message}`)
  }
}