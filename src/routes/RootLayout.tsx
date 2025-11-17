import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export const RootLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  )
}

