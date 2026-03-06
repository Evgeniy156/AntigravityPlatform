import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginWithGoogle, loginWithGithub, logout } from '../lib/firebase'

export default function Navbar() {
    const { user, loading } = useAuth()
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center
                            shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:inline">Antigravity</span>
                    </NavLink>

                    {/* Tabs */}
                    <div className="flex items-center gap-1">
                        <NavLink
                            to="/learn"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                                }`
                            }
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                                Обучение
                            </span>
                        </NavLink>
                        <NavLink
                            to="/develop"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                                }`
                            }
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                </svg>
                                Разработка
                            </span>
                        </NavLink>
                    </div>

                    {/* Auth */}
                    <div className="relative">
                        {loading ? (
                            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin m-2"></div>
                        ) : user ? (
                            <div>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border border-border" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-surface-light border border-border flex items-center justify-center text-primary font-bold">
                                            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border rounded-xl shadow-xl py-2 z-50">
                                        <div className="px-4 py-3 border-b border-border mb-2">
                                            <p className="text-sm font-medium text-text-primary truncate">{user.displayName || 'Пользователь'}</p>
                                            <p className="text-xs text-text-secondary truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <div className="px-4 py-2 border-b border-border mb-2 flex justify-between items-center text-xs text-text-secondary">
                                            <span>Экспорты (Free)</span>
                                            <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{user.exportCount} / 5</span>
                                        </div>
                                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-light transition-colors">
                                            Выйти из аккаунта
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button onClick={loginWithGoogle} className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap">
                                    Google
                                </button>
                                <button onClick={loginWithGithub} className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap">
                                    GitHub
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
