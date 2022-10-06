import { onCall, httpsError, getDoc, setDoc, serverTimestamp, updateDoc } from './_firebase'
import { userAuthenticated } from './_userAuthenticated'
import { User } from '../../types'

export type SignInRequrest = unknown

export type SignInResponse = {
  user: User
  userAgent: string | undefined
}

export const signIn = onCall(async (_req: SignInRequrest, context): Promise<SignInResponse> => {
  const { uid, token, userAgent, ip } = await userAuthenticated({ context })

  const doc = await getDoc<User>(`users/${uid}`)

  if (doc.exists) {
    const updateData: Partial<User> = {
      ip,
      lastLogin: serverTimestamp(),
    }

    await updateDoc<User>(`users/${uid}`, updateData).catch((e: Error) => {
      // throw httpsError('internal', e.message);
      throw httpsError('not-found', 'Failed to update profile.')
    })

    const user: User = { ...doc.data(), ...updateData }

    return { user, userAgent }
  } else {
    const user: User = {
      uid,
      displayName: token.name ?? '名無しさん',
      icon: Math.floor(Math.random() * 16 + 1),
      email: token.email ?? null,
      status: null,
      ip,
      isAnonymous: token.firebase.sign_in_provider === 'anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }

    await setDoc<User>(`users/${uid}`, user).catch((e: Error) => {
      // throw httpsError('internal', e.message);
      throw httpsError('not-found', 'Failed to create profile.')
    })

    return { user, userAgent }
  }
})
