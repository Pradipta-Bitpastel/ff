import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/verification']
const PROTECTED_ROUTES = ['/home']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthed =
        Boolean(request.cookies.get('access_token')?.value) ||
        Boolean(request.cookies.get('refresh_token')?.value)

    if (isAuthed && PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    if (!isAuthed && PROTECTED_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/home', '/verification'],
}
