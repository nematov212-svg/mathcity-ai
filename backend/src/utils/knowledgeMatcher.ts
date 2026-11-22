import fs from 'fs';
import path from 'path';

export interface KnowledgeItem {
  id: number;
  grade: number;
  topic: string;
  question: string;
  answer: string;
  steps: string[];
}

let cachedKnowledge: KnowledgeItem[] | null = null;

export function loadKnowledgeBase(): KnowledgeItem[] {
  if (cachedKnowledge) return cachedKnowledge;

  const candidatePaths = [
    path.resolve(process.cwd(), 'src/data/math_knowledge.json'),
    path.resolve(process.cwd(), 'data/math_knowledge.json'),
    path.resolve(process.cwd(), 'dist/data/math_knowledge.json'),
    path.resolve(__dirname, '../data/math_knowledge.json'),
    path.resolve(__dirname, '../../data/math_knowledge.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        cachedKnowledge = JSON.parse(raw) as KnowledgeItem[];
        return cachedKnowledge;
      } catch (_) { }
    }
  }

  return [];
}

/**
 * Tokenizes text for Uzbek mathematical keyword matching
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\+\-\*\/\=²]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Finds top N most relevant few-shot examples from math_knowledge.json
 */
export function findBestMatches(query: string, limit = 3): KnowledgeItem[] {
  const all = loadKnowledgeBase();
  if (all.length === 0) return [];

  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) {
    return all.slice(0, limit);
  }

  // Detect query topic hint
  const qLower = query.toLowerCase();
  let topicBonus = '';
  if (qLower.includes('kasr') || qLower.includes('/')) topicBonus = 'kasrlar';
  else if (qLower.includes('foiz') || qLower.includes('%')) topicBonus = 'foizlar';
  else if (qLower.includes('tenglam') || qLower.includes('x =') || qLower.includes('x²')) topicBonus = 'tenglamalar';
  else if (qLower.includes('perimetr') || qLower.includes('yuza') || qLower.includes('sm') || qLower.includes('uchburchak')) topicBonus = 'geometriya';
  else if (qLower.includes('avtomobil') || qLower.includes('soat') || qLower.includes('daftar') || qLower.includes('masofa')) topicBonus = "so'zli masalalar";
  else if (qLower.includes('kvadrat') || qLower.includes('ifoda') || qLower.includes('yoying')) topicBonus = 'algebra';
  else topicBonus = 'arifmetika';

  const scored: { item: KnowledgeItem; score: number }[] = [];

  for (const item of all) {
    let score = 0;
    if (item.topic === topicBonus) score += 5;

    const itemTokens = tokenize(`${item.question} ${item.topic}`);
    for (const t of itemTokens) {
      if (queryTokens.has(t)) {
        score += 3;
      }
    }

    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Formats few-shot examples for the AI System Prompt
 */
export function formatFewShotContext(query: string, count = 3): string {
  const matches = findBestMatches(query, count);
  if (matches.length === 0) return '';

  const examples = matches.map((m, idx) => {
    return `Misol ${idx + 1} (${m.topic}, ${m.grade}-sinf):
Savol: ${m.question}
Bosqichma-bosqich yechim:
${m.steps.map((s, sIdx) => `  ${sIdx + 1}) ${s}`).join('\n')}
Yakuniy javob: **${m.answer}**`;
  });

  return `\n\nQUYIDAGI MATEMATIK NAMUNALARDAN FOYDALANIB JAVOB BER:\n${examples.join('\n\n')}`;
}
