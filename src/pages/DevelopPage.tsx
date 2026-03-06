import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { db } from '../lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

interface Message {
    id: number
    role: 'user' | 'mentor'
    text: string
}

const initialMessages: Message[] = [
    {
        id: 1,
        role: 'mentor',
        text: '👋 Привет! Я твой ИИ-Ментор. Расскажи, что за проект ты хочешь создать? Я помогу спроектировать архитектуру — от выбора агентов до экспорта MVP.',
    },
]

export default function DevelopPage() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [thinking, setThinking] = useState(false)
    const [showPaywall, setShowPaywall] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMsg: Message = { id: Date.now(), role: 'user', text: input }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setThinking(true)

        try {
            // Setup what we send to the backend. The backend expects an array of messages
            // Make sure not to pass `id` to openai, only role and content
            // We'll pass the whole history for context.
            const historyForOpenAI = [...messages, userMsg].map(m => ({
                role: m.role === 'mentor' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: historyForOpenAI })
            });
            const data = await response.json();

            const mentorMsg: Message = {
                id: Date.now() + 1,
                role: 'mentor',
                text: data.reply || data.error || 'Server error, no reply.'
            };
            setMessages((prev) => [...prev, mentorMsg])
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { id: Date.now(), role: 'mentor', text: 'Ошибка сети. Сервер не доступен.' }]);
        } finally {
            setThinking(false)
        }
    }

    const handleExport = async () => {
        if (!user) {
            alert("Пожалуйста, войдите в систему (кнопки вверху справа), чтобы экспортировать проект.")
            return
        }

        if (user.exportCount >= 5) {
            setShowPaywall(true)
            return
        }

        setIsExporting(true)
        try {
            const userRef = doc(db, 'users', user.uid)
            await updateDoc(userRef, {
                exportCount: user.exportCount + 1
            })

            // Mock download MVP
            const element = document.createElement("a");
            const file = new Blob([JSON.stringify({
                project: "Antigravity MVP Blueprint",
                timestamp: new Date().toISOString(),
                agents: ["discovery-interview", "coding-agent"]
            }, null, 2)], { type: 'application/json' });
            element.href = URL.createObjectURL(file);
            element.download = "blueprint.json";
            document.body.appendChild(element);
            element.click();

            alert(`Успешно! Скачан blueprint.json. Осталось бесплатных экспортов: ${4 - user.exportCount}`)
            // Update local state temporarily so user sees change immediately
            user.exportCount += 1;
        } catch (e) {
            console.error("Export failed", e)
            alert("Не удалось экспортировать проект.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">🛠 Разработка</h1>
                <p className="text-text-secondary">Собери свой MVP под руководством ИИ-Ментора</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-250px)]">
                {/* Chat */}
                <div className="lg:col-span-3 card flex flex-col p-0 overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-surface-light text-text-primary rounded-bl-md border border-border'
                                    }`}>
                                    {msg.role === 'mentor' && (
                                        <div className="flex items-center gap-2 mb-1.5 text-xs text-primary font-medium">
                                            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-bold">A</span>
                                            ИИ-Ментор
                                        </div>
                                    )}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {thinking && (
                            <div className="flex justify-start">
                                <div className="bg-surface-light border border-border rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1.5">
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-bold">A</span>
                                        ИИ-Ментор
                                    </div>
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                                        <span className="animate-bounce delay-0">●</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>●</span>
                                        <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>●</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-border p-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Опиши свой проект или задай вопрос..."
                                className="flex-1 bg-surface-light border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim()}
                                className="btn-primary px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Blueprint Canvas */}
                <div className="lg:col-span-2 card flex flex-col">
                    <h2 className="font-semibold text-sm text-text-secondary uppercase tracking-wider mb-4">
                        Blueprint Canvas
                    </h2>
                    <div className="flex-1 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6 relative">

                        {!user && (
                            <div className="absolute inset-0 bg-surface-card/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 flex-col p-4 border border-border">
                                <svg className="w-10 h-10 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <p className="text-sm font-medium">Войдите, чтобы сохранять Blueprint</p>
                            </div>
                        )}

                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <p className="text-text-secondary text-sm mb-1">Здесь появится схема твоего MVP</p>
                        <p className="text-text-secondary/60 text-xs">Развертывание...</p>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="btn-secondary w-full text-sm hover:!bg-primary hover:!text-white hover:!border-primary"
                        >
                            {isExporting ? 'Экспорт...' : `📦 Экспортировать MVP (${user ? user.exportCount : 0}/5 бесплатных)`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Paywall Modal */}
            {showPaywall && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setShowPaywall(false)}></div>
                    <div className="relative glass p-8 max-w-md w-full text-center border-primary/20 shadow-2xl shadow-primary/10">
                        <button
                            onClick={() => setShowPaywall(false)}
                            className="absolute top-4 right-4 text-text-secondary hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-warning to-danger rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-warning/20">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Откройте безграничные возможности</h3>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Вы исчерпали лимит из 5 бесплатных проектов. Перейдите на Premium, чтобы продолжить экспорт.
                        </p>
                        <button className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2 mb-3">
                            Подписаться за $19/мес
                        </button>
                        <button className="text-xs text-text-secondary hover:text-white underline" onClick={() => setShowPaywall(false)}>
                            Позже
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
