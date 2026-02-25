import { useState } from 'react'
import './index.css'
import Auth from './components/Auth'
import BluetoothPairing from './components/BluetoothPairing'
import AppShell from './components/AppShell'

export default function App() {
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
