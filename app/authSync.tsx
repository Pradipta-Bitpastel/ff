'use client'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

function clearSession() {
    sessionStorage.clear()
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
}

export function logout() {
    clearSession()
    new BroadcastChannel('auth').postMessage('logout')
    window.location.href = '/'
}

const AuthSync = () => {
    useEffect(() => {
        const bc = new BroadcastChannel('auth')
        bc.onmessage = (e) => {
            if (e.data === 'logout') {
                clearSession()
                window.location.href = '/'
            }
        }
        return () => bc.close()
    }, [])
    return null
}

export default AuthSync
