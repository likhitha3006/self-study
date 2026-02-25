import { SUBJECT_CHIPS, QUICK_PROMPTS } from "@/lib/chat-types";
import { BookOpen, Sparkles, Brain, Target } from "lucide-react";

interface WelcomeScreenProps {
  onPrompt: (text: string) => void;
}

const WelcomeScreen = ({ onPrompt }: WelcomeScreenProps) => {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">StudyMate AI</h1>
          <p className="text-muted-foreground text-lg">
            Your intelligent exam preparation companion
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Sparkles, title: "Simple Explanations", desc: "Complex concepts made easy" },
            { icon: Brain, title: "Practice Questions", desc: "MCQs, short & long answers" },
            { icon: Target, title: "Exam Focus", desc: "Key points & revision tips" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-4 text-left space-y-1.5"
            >
              <Icon className="w-5 h-5 text-accent" />
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Subject chips */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Pick a subject to start</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUBJECT_CHIPS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => onPrompt(`I want to study ${label}. What are the most important topics for exams?`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors border border-border"
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPrompt(prompt)}
              className="px-3 py-1.5 rounded-lg bg-surface-warm text-foreground text-xs font-medium hover:bg-muted transition-colors border border-border"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
