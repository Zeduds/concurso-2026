import { Component, computed, signal, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { QuestionGeneratorService, Question } from './services/question-generator.service';
import { SCHEDULE_POOL, DaySchedule } from './services/schedule.data';

type ViewMode = 'study' | 'quiz' | 'results';
type QuizState = 'waiting_answer' | 'answered';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private questionGen: QuestionGeneratorService = inject(QuestionGeneratorService);
  
  // -- State Signals --
  dayOffset = signal<number>(0); 
  viewMode = signal<ViewMode>('study');
  
  // Quiz Signals
  questions = signal<Question[]>([]);
  currentQuestionIndex = signal<number>(0);
  quizState = signal<QuizState>('waiting_answer');
  selectedAnswerIndex = signal<number>(-1);
  score = signal<number>(0);
  
  // Track last subject to enable "Generate More" feature
  lastSubject = signal<'math' | 'port' | null>(null);

  // Countdown Signal State
  timeRemaining = signal<string>('Calculando...');
  private intervalId: any;

  // -- Computed Properties --
  
  currentDateObj = computed(() => {
    const d = new Date();
    d.setDate(d.getDate() + this.dayOffset());
    return d;
  });

  formattedCurrentDate = computed(() => {
    return this.currentDateObj().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  currentDayIndex = computed(() => {
    const len = SCHEDULE_POOL.length;
    return ((this.dayOffset() % len) + len) % len;
  });

  currentSchedule = computed<DaySchedule>(() => {
    return SCHEDULE_POOL[this.currentDayIndex()];
  });

  // Helpers for Video Links (No longer using Sanitizer/Embeds)
  getPortThumbnail() {
    return `https://img.youtube.com/vi/${this.currentSchedule().port.videoId.trim()}/mqdefault.jpg`;
  }
  
  getPortLink() {
    return `https://www.youtube.com/watch?v=${this.currentSchedule().port.videoId.trim()}`;
  }

  getMathThumbnail() {
    return `https://img.youtube.com/vi/${this.currentSchedule().math.videoId.trim()}/mqdefault.jpg`;
  }

  getMathLink() {
    return `https://www.youtube.com/watch?v=${this.currentSchedule().math.videoId.trim()}`;
  }

  // Current Question Data
  currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  
  isLastQuestion = computed(() => this.currentQuestionIndex() === this.questions().length - 1);
  
  quizProgress = computed(() => {
    if (this.questions().length === 0) return 0;
    return ((this.currentQuestionIndex() + 1) / this.questions().length) * 100;
  });

  scorePercentage = computed(() => {
    if (this.questions().length === 0) return 0;
    return Math.round((this.score() / this.questions().length) * 100);
  });
  
  countdown = computed(() => this.timeRemaining());

  // -- Lifecycle --

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // -- Actions --

  changeDay(days: number) {
    this.dayOffset.update(v => v + days);
    this.viewMode.set('study');
  }

  startQuiz(subject: 'math' | 'port') {
    this.lastSubject.set(subject); // Save for restart
    const sched = this.currentSchedule();
    const type = subject === 'math' ? sched.math.type : sched.port.type;
    
    const qs = this.questionGen.generateSubjectQuestions(subject, type, 30);
    
    this.questions.set(qs);
    this.currentQuestionIndex.set(0);
    this.score.set(0);
    this.selectedAnswerIndex.set(-1);
    this.quizState.set('waiting_answer');
    this.viewMode.set('quiz');
  }

  // New feature: Generate more questions for the same subject
  restartQuiz() {
    const subj = this.lastSubject();
    if (subj) {
      this.startQuiz(subj);
    }
  }

  selectAnswer(index: number) {
    if (this.quizState() === 'answered') return;

    this.selectedAnswerIndex.set(index);
    this.quizState.set('answered');
    
    if (index === this.currentQuestion().correctIndex) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion() {
    if (this.isLastQuestion()) {
      this.viewMode.set('results');
    } else {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedAnswerIndex.set(-1);
      this.quizState.set('waiting_answer');
    }
  }

  resetToStudy() {
    this.viewMode.set('study');
    this.questions.set([]);
  }
  
  exitQuiz() {
    this.resetToStudy();
  }

  // -- Helpers --

  private startCountdown() {
    const targetDate = new Date('2026-03-01T09:00:00');

    const update = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        this.timeRemaining.set("A PROVA COMEÇOU!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      this.timeRemaining.set(`${days}d ${hours}h`);
    };

    update();
    this.intervalId = setInterval(update, 60000); 
  }
}