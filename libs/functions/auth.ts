import { signOut as _signOut } from 'firebase/auth'
import {
  auth,
  onValue,
  set,
  onDisconnect,
  timestamp,
  onDocSnapshot,
  OnDisconnect,
  httpsCallable,
} from 'libs/firebase'
import { User } from 'types/firestore'
import { SignInRequrest, SignInResponse } from 'types/functions'

export type SignIn = (arg?: SignInRequrest) => Promise<SignInResponse>

export const signIn: SignIn = async () => {
  const onDisconnect = onOnline()

  const { data } = await httpsCallable<SignInRequrest, SignInResponse>('signIn')

  const { user, userAgent } = data

  observerIpAddress(user, onDisconnect)

  return { user, userAgent }
}

export type SignOut = () => Promise<void>

export const signOut: SignOut = async () => {
  await onOffline()

  await _signOut(auth)
}

export type OnOnline = () => OnDisconnect | undefined

export const onOnline: OnOnline = () => {
  const { currentUser } = auth

  if (!currentUser) return

  const { uid } = currentUser

  const _onDisconnect = onDisconnect(`/status/${uid}`)

  onValue(`info/connected`, (snapshot) => {
    if (snapshot.val() === false) return

    _onDisconnect
      .set({
        state: 'offline',
        timestamp: timestamp.database(),
      })
      .then(
        async () =>
          await set(`/status/${uid}`, {
            state: 'online',
            timestamp: timestamp.database(),
          }),
      )
  })

  return _onDisconnect
}

export type OnOffline = () => Promise<void>

export const onOffline: OnOffline = async () => {
  const { currentUser } = auth

  if (!currentUser) return

  const { uid } = currentUser

  await set(`/status/${uid}`, {
    state: 'offline',
    timestamp: timestamp.database(),
  })
}

export const observerIpAddress = (user: User, onDisconnect: OnDisconnect | undefined) => {
  const { uid, ip: currentIp } = user

  onDocSnapshot<User>(`users/${uid}`, async (doc) => {
    const { ip } = doc.data()

    if (ip === currentIp) return

    if (onDisconnect) onDisconnect.cancel()

    await _signOut(auth)
  })
}
