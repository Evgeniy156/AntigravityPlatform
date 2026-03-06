import { useState, useEffect } from 'react';

const modules = [
    { id: 1, title: 'Что такое Antigravity?', status: 'available', desc: 'Введение в мир ИИ-агентов, MCP и систему навыков (Skills).' },
    { id: 2, title: 'Архитектура агентов', status: 'available', desc: 'Как устроены мультиагентные системы и как они общаются.' },
    { id: 3, title: 'Навыки и промпты', status: 'soon', desc: 'Каталог Skills, как выбрать правильного агента для задачи.' },
    { id: 4, title: 'NotebookLM интеграция', status: 'soon', desc: 'Подключение базы знаний через MCP-протокол.' },
    { id: 5, title: 'Сборка MVP', status: 'locked', desc: 'Практика: собрать мультиагентную систему из готовых блоков.' },
    { id: 6, title: 'Деплой и монетизация', status: 'locked', desc: 'Как выпустить и продать свой AI-продукт.' },
]

interface Skill {
    id: string;
    title: string;
    desc: string;
    status: string;
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        available: 'bg-success/15 text-success',
        soon: 'bg-warning/15 text-warning',
        locked: 'bg-border text-text-secondary',
    }
    const labels: Record<string, string> = {
        available: 'Доступен',
        soon: 'Скоро',
        locked: '🔒 Платный',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
            {labels[status]}
        </span>
    )
}

export default function LearnPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loadingSkills, setLoadingSkills] = useState(true);

    useEffect(() => {
        fetch('/api/skills')
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setSkills(data.data);
                }
            })
            .catch(err => console.error("Error fetching skills:", err))
            .finally(() => setLoadingSkills(false));
    }, []);

    // A fallback emoji mapping for known skills or a default piece
    const getEmojiForSkill = (id: string) => {
        const charCode = id.charCodeAt(0);
        const emojis = ['🔌', '🤖', '📚', '🔒', '💡', '🔍', '📋', '🧩', '🌐', '🛠️'];
        return emojis[charCode % emojis.length];
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">📚 Обучение</h1>
                <p className="text-text-secondary">Теория, примеры и практика работы с ИИ-агентами</p>
            </div>

            {/* Modules */}
            <section className="mb-14">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Модули курса
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((m) => (
                        <div key={m.id} className={`card cursor-pointer ${m.status === 'locked' ? 'opacity-60' : ''}`}>
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-2xl font-bold text-primary/30">0{m.id}</span>
                                <StatusBadge status={m.status} />
                            </div>
                            <h3 className="font-semibold mb-1">{m.title}</h3>
                            <p className="text-text-secondary text-sm">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Catalog */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <span className="w-1 h-6 bg-accent rounded-full" />
                        Ваши Установленные Навыки (.agents)
                    </h2>
                </div>

                {loadingSkills ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="card text-center py-10 text-text-secondary">
                        У вас пока нет установленных навыков агентов в C:\Users\III\Desktop\Portfolio\.agents\skills.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skills.map((s) => (
                            <div key={s.id} className="card group cursor-pointer border hover:border-accent/40 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{getEmojiForSkill(s.id)}</span>
                                    <div className="flex-1 min-w-0">
                                        <code className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded block truncate" title={s.title}>{s.title}</code>
                                    </div>
                                </div>
                                <p className="text-text-secondary text-sm line-clamp-3" title={s.desc}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
