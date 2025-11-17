import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { CharactersListPage } from '../pages/CharactersListPage'
import { CharacterDetailPage } from '../pages/CharacterDetailPage'
import { CharactersByLocationPage } from '../pages/CharactersByLocationPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <CharactersListPage /> },
      { path: 'characters/:id', element: <CharacterDetailPage /> },
      { path: 'locations', element: <CharactersByLocationPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

