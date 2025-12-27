import { cookies } from 'next/headers'

const FLASH_MESSAGE_KEY = 'flash_message'
const FLASH_TYPE_KEY = 'flash_type'

export type FlashType = 'success' | 'error' | 'info'

export async function getFlashMessage(): Promise<{
  message: string | null
  type: FlashType | null
}> {
  const cookieStore = await cookies()

  const message = cookieStore.get(FLASH_MESSAGE_KEY)?.value ?? null
  const type = (cookieStore.get(FLASH_TYPE_KEY)?.value as FlashType) ?? null

  if (message) {
    cookieStore.delete(FLASH_MESSAGE_KEY)
    cookieStore.delete(FLASH_TYPE_KEY)
  }

  return { message, type }
}