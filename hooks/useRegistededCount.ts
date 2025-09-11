import { useEffect, useState } from "react"
import { collection, query, where, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useRegisteredCount(eventId: string) {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchCount() {
      setLoading(true)
      try {
        const q = query(
          collection(db, "registrations"),
          where("eventId", "==", eventId),
        )
        const snapshot = await getCountFromServer(q)
        if (isMounted) setCount(snapshot.data().count)
      } catch (err) {
        if (isMounted) setError(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (eventId) fetchCount()
    return () => { isMounted = false }
  }, [eventId])

  return { count, loading, error }
}