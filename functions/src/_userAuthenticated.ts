import { CallableContext, httpsError, DecodedIdToken } from './_firebase'

export type UserAuthenticatedRequest = {
  context: CallableContext
}

export type UserAuthenticatedResponse = {
  uid: string
  token: DecodedIdToken
  userAgent: string | undefined
  ip: string | string[] | null
}

export type UserAuthenticated = (
  req: UserAuthenticatedRequest,
) => Promise<UserAuthenticatedResponse>

export const userAuthenticated: UserAuthenticated = async ({ context }) => {
  if (!context.auth) {
    throw httpsError('unauthenticated', 'Unauthenticated user cannot sign in.')
  }

  const { uid, token } = context.auth
  const userAgent = context.rawRequest.headers['user-agent']
  const ip = context.rawRequest.headers['x-appengine-user-ip'] ?? null

  return { uid, token, userAgent, ip }
}
