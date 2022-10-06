# Online Reversi

## Branch

`main` This is a product branch.
`hotfix` This is a branch for urgent fixes.
`dev` This is a branch that primarily develops.

### Install

```
1. node -v → v16.**.*
2. yarn install
3. firebase login
```

### Run

```
1. yarn dev
# or
1. yarn start
```

### Build & Deploy

```
Hosting
1. yarn build
2. firebase deploy --only hosting

Cloud Functions
1. firebase deploy --only functions:signIn
# or
1. firebase deploy --only functions:signIn,functions:signOut
```

## Use

- Next.js
- TypeScript
- React
  - react-countup
  - react-copy-to-clipboard
  - react-hook-form
- Emotion
  - emotion/react
  - emotion/styled
- Babel
- ESLint
- Prettier
- Fortawesome
