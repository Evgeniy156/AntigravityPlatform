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

app.get('/api/skills', (req, res) => {
    try {
        if (!fs.existsSync(AGENTS_SKILLS_PATH)) {
            return res.status(404).json({ error: 'Skills directory not found' });
        }

        const skillFolders = fs.readdirSync(AGENTS_SKILLS_PATH, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const skills = skillFolders.map(folderName => {
            const skillFilePath = path.join(AGENTS_SKILLS_PATH, folderName, 'SKILL.md');

            if (!fs.existsSync(skillFilePath)) {
                return null;
            }

            const content = fs.readFileSync(skillFilePath, 'utf8');
            let name = folderName;
            let description = 'Описание навыка отсутствует (парсинг YAML)';

            // Extract YAML frontmatter
            const match = content.match(/^---\n([\s\S]+?)\n---/);
            if (match) {
                const frontmatter = match[1];
                const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
                const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

                if (nameMatch) name = nameMatch[1].trim();
                // YAML description might be multi-line or just one string, we take whatever matched naively,
                // or if it spans lines, we might miss it. Let's try to match it cleanly.
                if (descMatch) description = descMatch[1].trim();
            }

            return {
                id: folderName,
                title: name,
                desc: description,
                status: 'installed', // From .agents
            };
        }).filter(skill => skill !== null);

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

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fast and cheap for MVP
            messages: [
                { role: "system", content: "Ты ИИ-Ментор для разработчика. Помогаешь проектировать MVP и архитектуру мультиагентных систем. Давай краткие, полезные советы." },
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
