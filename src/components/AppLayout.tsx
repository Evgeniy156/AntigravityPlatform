import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t border-border py-6 text-center text-text-secondary text-sm">
                <p>© 2026 Antigravity Platform · Обучающая платформа ИИ-разработки</p>
            </footer>
        </div>
    )
}
