export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[];
}

export const SUBJECT_CHIPS = [
  { label: "Mathematics", emoji: "📐" },
  { label: "Physics", emoji: "⚛️" },
  { label: "Chemistry", emoji: "🧪" },
  { label: "Programming", emoji: "💻" },
  { label: "Biology", emoji: "🧬" },
  { label: "History", emoji: "📜" },
  { label: "English", emoji: "📖" },
  { label: "Economics", emoji: "📊" },
] as const;

export const QUICK_PROMPTS = [
  "Explain this concept simply",
  "Give me practice questions",
  "Quick revision summary",
  "Solve this step by step",
] as const;
