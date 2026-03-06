import { Link } from 'react-router-dom'

const features = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        title: 'Интерактивное обучение',
        desc: 'Теория, примеры и практика в едином симуляторе ИИ-Архитектора.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        ),
        title: 'ИИ-Ментор',
        desc: 'Персональный помощник, который ведёт от идеи до готового MVP.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: 'Быстрый старт',
        desc: '5 бесплатных проектов. Экспортируйте Blueprint и начинайте строить.',
    },
]

export default function HomePage() {
    return (
        <div className="relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
            </div>

            {/* Hero */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Бета-версия — Начните бесплатно
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                    Научись строить
                    <br />
                    <span className="gradient-text">ИИ-агентов</span>
                </h1>

                <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                    Интерактивная платформа для обучения разработке мультиагентных систем.
                    Собирайте архитектуры из готовых скиллов, учитесь у ИИ-Ментора и
                    экспортируйте готовые MVP за минуты.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/learn" className="btn-primary text-lg px-8 py-3">
                        🚀 Начать обучение
                    </Link>
                    <Link to="/develop" className="btn-secondary text-lg px-8 py-3">
                        🛠 Открыть разработку
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="card group hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary mb-5
                              group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
