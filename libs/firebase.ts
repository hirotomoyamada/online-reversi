import { initializeApp } from 'firebase/app'
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  Database,
  getDatabase,
  ref,
  get as _get,
  set as _set,
  onValue as _onValue,
  onDisconnect as _onDisconnect,
  OnDisconnect as _OnDisconnect,
  DataSnapshot,
  serverTimestamp as DatabaseServerTimestamp,
} from 'firebase/database'
import {
  Firestore,
  getFirestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  doc,
  getDoc as _getDoc,
  setDoc as _setDoc,
  addDoc as _addDoc,
  updateDoc as _updateDoc,
  onSnapshot as _onSnapshot,
  SetOptions,
  UpdateData as _UpdateData,
  WithFieldValue as _WithFieldValue,
  collection,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  serverTimestamp as FirestoreServerTimestamp,
  query as _query,
  orderBy,
  FieldPath,
  OrderByDirection,
  where,
  WhereFilterOp,
} from 'firebase/firestore'
import {
  getFunctions,
  httpsCallable as _httpsCallable,
  HttpsCallableResult,
} from 'firebase/functions'

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})

export const auth = ((): Auth => getAuth())()
export const firestore = ((): Firestore => getFirestore())()
export const functions = getFunctions(app, 'asia-northeast1')
export const database = ((): Database => getDatabase())()
export const providerGoogle = new GoogleAuthProvider()

export const converter = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (modelObject: _WithFieldValue<T>) => modelObject as DocumentData,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, op) => snapshot.data(op) as T,
})

export const timestamp = {
  firestore: FirestoreServerTimestamp,
  database: DatabaseServerTimestamp,
}

/**
 * Cloud Functions
 */

export const httpsCallable = async <Request, Response>(
  name: string,
): Promise<HttpsCallableResult<Response>> =>
  await _httpsCallable<Request, Response>(functions, name)()

/**
 * Firestore
 */

export type WithFieldValue<T> = _WithFieldValue<T>
export type UpdateData<T> = _UpdateData<T>

export const getDoc = async <T>(_path: string) => {
  const [path, ...pathSegments] = _path.split('/')

  const q = doc(firestore, path, ...pathSegments).withConverter(converter<T>())

  return await _getDoc(q)
}

export const addDoc = async <T>(_path: string, data: WithFieldValue<T>) => {
  const [path, ...pathSegments] = _path.split('/')

  const q = collection(firestore, path, ...pathSegments).withConverter(converter<T>())

  return await _addDoc(q, data)
}

export const setDoc = async <T>(
  _path: string,
  data: WithFieldValue<T>,
  options: SetOptions = { merge: false },
) => {
  const [path, ...pathSegments] = _path.split('/')

  const q = doc(firestore, path, ...pathSegments).withConverter(converter<T>())

  return await _setDoc(q, data, options)
}

export const updateDoc = async <T>(_path: string, data: UpdateData<T>) => {
  const [path, ...pathSegments] = _path.split('/')

  const q = doc(firestore, path, ...pathSegments).withConverter(converter<T>())

  return await _updateDoc(q, data)
}

export const onDocSnapshot = <T>(
  _path: string,
  onNext: (snapshot: Omit<DocumentSnapshot<T>, 'data'> & { data(): T }) => void,
  onError?: ((error: FirestoreError) => void) | undefined,
  onCompletion?: (() => void) | undefined,
) => {
  const [path, ...pathSegments] = _path.split('/')

  const q = doc(firestore, path, ...pathSegments).withConverter(converter<T>())

  return _onSnapshot(q, onNext as (snapshot: DocumentSnapshot<T>) => void, onError, onCompletion)
}

export const onCollectionSnapshot = <T>(
  query: {
    path: string
    where?: [string | FieldPath, WhereFilterOp, unknown][]
    orderBy?: [string | FieldPath, OrderByDirection | undefined]
  },
  onNext: (snapshot: Omit<DocumentSnapshot<T>, 'data'> & { data(): T }) => void,
  onError?: ((error: FirestoreError) => void) | undefined,
  onCompletion?: (() => void) | undefined,
) => {
  const [path, ...pathSegments] = query.path.split('/')

  const q = _query(
    collection(firestore, path, ...pathSegments).withConverter(converter<T>()),
    ...(query.where?.map(([fieldPath, opStr, value]) => where(fieldPath, opStr, value)) ?? []),
    ...(query.orderBy ? [orderBy(...query.orderBy)] : []),
  ) as unknown as DocumentReference<T>

  return _onSnapshot(q, onNext as (snapshot: DocumentSnapshot<T>) => void, onError, onCompletion)
}

/**
 * realtimeDatabase
 */

export type OnDisconnect = _OnDisconnect

export const get = async (path: string) => await _get(ref(database, path))

export const set = async (path: string, value: unknown) => await _set(ref(database, path), value)

export const onValue = (
  path: string,
  callback: (snapshot: DataSnapshot) => unknown,
  cancelCallback?: (error: Error) => unknown,
) => _onValue(ref(database, path), callback, cancelCallback)

export const onDisconnect = (path: string) => _onDisconnect(ref(database, path))
