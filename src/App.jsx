import { useState } from 'react'
import './index.css'
import Auth from './components/Auth'
import BluetoothPairing from './components/BluetoothPairing'
import AppShell from './components/AppShell'
import BlockchainAdmin from './pages/BlockchainAdmin'

export default function App() {
  // Hidden admin route — not linked from the UI, accessible only via URL
  const params = new URLSearchParams(window.location.search)
  if (params.get('admin') === 'blockchain') {
    return <BlockchainAdmin />
  }

  const [user, setUser] = useState(null)
  const [paired, setPaired] = useState(false)

  if (!user) {
    return <Auth onAuthenticated={(userData) => setUser(userData)} />
  }

  if (!paired) {
    return <BluetoothPairing onConnected={() => setPaired(true)} />
  }

  return <AppShell deviceConnected={true} user={user} />
}
