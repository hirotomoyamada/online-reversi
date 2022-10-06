// eslint-disable-next-line import/no-unresolved
import { firestore } from 'firebase-admin'

export interface User {
  uid: string
  displayName: string
  email: string | null
  icon: number
  status: 'online' | 'offline' | null
  ip: string | string[] | null
  isAnonymous: boolean
  createdAt: firestore.FieldValue
  updatedAt: firestore.FieldValue
  lastLogin: firestore.FieldValue
}
