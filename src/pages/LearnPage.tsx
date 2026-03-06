const modules = [
    { id: 1, title: 'Что такое Antigravity?', status: 'available', desc: 'Введение в мир ИИ-агентов, MCP и систему навыков (Skills).' },
    { id: 2, title: 'Архитектура агентов', status: 'available', desc: 'Как устроены мультиагентные системы и как они общаются.' },
    { id: 3, title: 'Навыки и промпты', status: 'soon', desc: 'Каталог Skills, как выбрать правильного агента для задачи.' },
    { id: 4, title: 'NotebookLM интеграция', status: 'soon', desc: 'Подключение базы знаний через MCP-протокол.' },
    { id: 5, title: 'Сборка MVP', status: 'locked', desc: 'Практика: собрать мультиагентную систему из готовых блоков.' },
    { id: 6, title: 'Деплой и монетизация', status: 'locked', desc: 'Как выпустить и продать свой AI-продукт.' },
]

const skillCards = [
    { name: 'discovery-interview', emoji: '🔍', desc: 'Глубинное интервью для превращения идеи в спецификацию' },
    { name: 'coding-agent', emoji: '🧩', desc: 'Делегирование задач агентам Codex, Claude Code, Pi' },
    { name: 'gh-issues', emoji: '📋', desc: 'Автоматическое решение GitHub Issues параллельными агентами' },
    { name: 'security-review', emoji: '🔒', desc: 'Проверка безопасности при работе с аутентификацией и API' },
    { name: 'api-design', emoji: '🌐', desc: 'Паттерны REST API, коды статусов, пагинация' },
    { name: 'mcp-builder', emoji: '🔌', desc: 'Создание MCP-серверов для интеграции внешних сервисов' },
]

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
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-accent rounded-full" />
                    Каталог навыков (Skills)
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillCards.map((s) => (
                        <div key={s.name} className="card group cursor-pointer">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{s.emoji}</span>
                                <code className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">{s.name}</code>
                            </div>
                            <p className="text-text-secondary text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
