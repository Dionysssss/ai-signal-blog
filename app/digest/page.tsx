import { redirect } from 'next/navigation'

export default function DigestRedirect() {
  const today = new Date().toISOString().slice(0, 10)
  redirect(`/digest/${today}`)
}
