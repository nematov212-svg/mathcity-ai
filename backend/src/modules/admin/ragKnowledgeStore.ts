import fs from 'fs';
import path from 'path';

export interface RAGKnowledgeDoc {
  id: string;
  title: string;
  category: 'RULE' | 'FORMULA' | 'TEXTBOOK' | 'QA';
  grade?: number;
  topic: string;
  content: string; // The text content or formula
  addedBy: string;
  createdAt: string;
}

class RAGKnowledgeStore {
  private docs: RAGKnowledgeDoc[] = [];
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(process.cwd(), 'data/rag_knowledge.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.docs = JSON.parse(raw);
      } else {
        // Seed initial essential formulas & rules
        this.docs = [
          {
            id: 'rag-1',
            title: 'Kvadrat tenglama ildizlari (Viyet va Diskriminant)',
            category: 'FORMULA',
            grade: 8,
            topic: 'Algebra / Kvadrat tenglamalar',
            content: 'ax² + bx + c = 0 tenglamada Diskriminant D = b² - 4ac. Agar D > 0 bo‘lsa, ikkita haqiqiy ildiz: x1,2 = (-b ± √D) / (2a). Agar D = 0 bo‘lsa, yagona ildiz: x = -b / (2a). Agar D < 0 bo‘lsa, haqiqiy ildizlar yo‘q. Viyet teoremasi: x1 + x2 = -b/a, x1 * x2 = c/a.',
            addedBy: 'Bosh administrator',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'rag-2',
            title: 'Pifagor teoremasi',
            category: 'FORMULA',
            grade: 7,
            topic: 'Geometriya / To‘g‘ri burchakli uchburchak',
            content: 'To‘g‘ri burchakli uchburchakda gipotenuzaning kvadrati katetlarning kvadratlari yig‘indisiga teng: c² = a² + b². Gipotenuzani topish: c = √(a² + b²). Katetni topish: a = √(c² - b²).',
            addedBy: 'Bosh administrator',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'rag-3',
            title: 'Kasrlarni qo‘shish va ayirish qoidasi',
            category: 'RULE',
            grade: 5,
            topic: 'Kasrlar',
            content: 'Maxrajlari har xil bo‘lgan kasrlarni qo‘shish yoki ayirish uchun avval ularni eng kichik umumiy maxrajga (EKUK) keltirish lozim, so‘ngra maxrajni o‘zgarishsiz qoldirib, suratlar qo‘shiladi yoki ayriladi: a/b + c/d = (a*d + b*c) / (b*d).',
            addedBy: 'Bosh administrator',
            createdAt: new Date().toISOString(),
          },
        ];
        this.saveToDisk();
      }
    } catch (_) {
      // In-memory fallback
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.docs, null, 2), 'utf-8');
    } catch (_) {}
  }

  getAllDocs(): RAGKnowledgeDoc[] {
    return [...this.docs];
  }

  addDoc(doc: Omit<RAGKnowledgeDoc, 'id' | 'createdAt'>): RAGKnowledgeDoc {
    const newDoc: RAGKnowledgeDoc = {
      ...doc,
      id: `rag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.docs.unshift(newDoc);
    this.saveToDisk();
    return newDoc;
  }

  deleteDoc(id: string): boolean {
    const idx = this.docs.findIndex((d) => d.id === id);
    if (idx >= 0) {
      this.docs.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  search(query: string, limit = 3): RAGKnowledgeDoc[] {
    if (!query || !query.trim()) return this.docs.slice(0, limit);
    const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);

    const scored = this.docs.map((doc) => {
      let score = 0;
      const combined = `${doc.title} ${doc.topic} ${doc.content}`.toLowerCase();
      for (const t of tokens) {
        if (combined.includes(t)) score++;
      }
      return { doc, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.doc);
  }
}

export const ragKnowledgeStore = new RAGKnowledgeStore();
