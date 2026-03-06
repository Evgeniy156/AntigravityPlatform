import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Init OpenAI
// We won't crash if the key is missing, we'll just return an error gracefully when the user tries to chat.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// Path to the .agents/skills directory on the user's desktop
// Using the explicit path as requested by the user
const AGENTS_SKILLS_PATH = 'C:/Users/III/Desktop/Portfolio/.agents/skills';

function getLocalSkills() {
    if (!fs.existsSync(AGENTS_SKILLS_PATH)) {
        return [];
    }
    const skillFolders = fs.readdirSync(AGENTS_SKILLS_PATH, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    return skillFolders.map(folderName => {
        const skillFilePath = path.join(AGENTS_SKILLS_PATH, folderName, 'SKILL.md');
        if (!fs.existsSync(skillFilePath)) return null;

        const content = fs.readFileSync(skillFilePath, 'utf8');
        let name = folderName;
        let description = 'Описание навыка отсутствует';

        const match = content.match(/^---\n([\s\S]+?)\n---/);
        if (match) {
            const frontmatter = match[1];
            const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
            const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

            if (nameMatch) name = nameMatch[1].trim();
            if (descMatch) description = descMatch[1].trim();
        }

        return {
            id: folderName,
            title: name,
            desc: description,
            status: 'installed',
        };
    }).filter(skill => skill !== null);
}

app.get('/api/skills', (req, res) => {
    try {
        const skills = getLocalSkills();
        if (skills.length === 0 && !fs.existsSync(AGENTS_SKILLS_PATH)) {
            return res.status(404).json({ error: 'Skills directory not found' });
        }
        res.json({ data: skills });
    } catch (error: any) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- AI Mentor Chat Endpoint ---
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key') {
            return res.json({
                reply: "⚠️ Серверу требуется валидный `OPENAI_API_KEY` в файле `.env`, чтобы я мог ответить. Добавьте его, перезапустите `npm run dev` и задайте вопрос снова!"
            });
        }

        // --- RAG / Context Injection ---
        // Dynamically read available skills
        const skills = getLocalSkills();
        let skillsContext = "У пользователя пока нет установленных навыков.";
        if (skills.length > 0) {
            skillsContext = "У пользователя УЖЕ УСТАНОВЛЕНЫ следующие навыки (их можно использовать для делегирования задач):\n" +
                skills.map((s: any) => `- **${s.title}** (${s.id}): ${s.desc}`).join('\n');
        }

        const systemPrompt = `Ты ИИ-Ментор для разработчика. Твоя задача — помогать проектировать MVP и архитектуру мультиагентных систем.
Давай краткие, полезные советы.

[NotebookLM / Известный Контекст Среды Пользователя]
${skillsContext}

Обязательно используй эту информацию для рекомендаций. Советуй конкретные навыки для подходящих этапов разработки.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast and cheap for MVP
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: error.message || 'Error communicating with AI' });
    }
});

app.listen(PORT, () => {
    console.log(`Antigravity Node.js Backend listening on port ${PORT}`);
});
