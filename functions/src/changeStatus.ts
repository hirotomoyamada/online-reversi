import { User } from '../../types'
import { onUpdateDatabase, Timestamp, updateDoc } from './_firebase'

export const changeStatus = onUpdateDatabase('/status/{uid}', async ({ after }, context) => {
  const event = after.val()

  const ref = await after.ref.once('value')
  const snapshot = ref.val()

  if (snapshot.timestamp > event.timestamp) return

  const data: Partial<User> = {
    status: event.state,
    lastLogin: Timestamp.fromDate(new Date(event.timestamp)),
  }

  await updateDoc(`users/${context.params.uid}`, data)

  return
})
