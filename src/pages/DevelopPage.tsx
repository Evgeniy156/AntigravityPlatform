import { useState } from 'react'

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
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [thinking, setThinking] = useState(false)

    const sendMessage = () => {
        if (!input.trim()) return
        const userMsg: Message = { id: Date.now(), role: 'user', text: input }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setThinking(true)

        // Simulate AI response
        setTimeout(() => {
            const mentorMsg: Message = {
                id: Date.now() + 1,
                role: 'mentor',
                text: 'Отличная идея! Давай разберём её по шагам. Для такого проекта я бы рекомендовал использовать навык **discovery-interview** для проработки требований, затем **coding-agent** для параллельной генерации кода. Что думаешь?',
            }
            setMessages((prev) => [...prev, mentorMsg])
            setThinking(false)
        }, 1500)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                    <div className="flex-1 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <p className="text-text-secondary text-sm mb-1">Здесь появится схема твоего MVP</p>
                        <p className="text-text-secondary/60 text-xs">Начни диалог с Ментором, чтобы собрать архитектуру</p>
                    </div>

                    <div className="mt-4">
                        <button className="btn-secondary w-full text-sm" disabled>
                            📦 Экспортировать MVP (0/5 бесплатных)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
