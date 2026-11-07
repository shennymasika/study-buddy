# Study Buddy — Computer Studies Quest (IST1020)

Gamified learning application skeleton for IST1020 Computer Studies, inspired by Duolingo-style game mechanics with tactile 3D elements, hearts/XP/streak systems, and interactive question evaluation states.

---

## 🚀 Quick Start

To launch the development server locally:

```bash
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🧩 Reusable Gamification Components

The application skeleton is architected into modular, reusable components:

### 1. Tactile 3D Buttons (`src/components/common/Button.tsx`)
- **Bevel 3D Effect**: Bottom bevel border that depresses on click (`active:translate-y-1 active:border-b-0`).
- **Variants**: `primary` (emerald green), `secondary` (sky blue), `amber` (flame streak), `danger` (ruby red), `outline`, and `ghost`.
- **States**: Default, hover, active/pressed, loading spinner, and disabled.
- **Sizes**: `sm`, `md`, `lg`, and `xl`, with full-width and icon support.

### 2. Gamification Status Bar (`src/components/gamification/`)
- **`HeartDisplay`**: 5 maximum hearts, heart-loss shake animation, depleted visual state, and tooltip countdown for heart restoration (1 heart every 30m).
- **`StreakDisplay`**: Animated flame icon, consecutive correct answer tracking, and alert for the +5 XP streak bonus every 3 consecutive correct answers.
- **`XpDisplay`**: XP gem pill with floating `+XP` bonus animations upon correct responses.
- **`StatHeader`**: Universal sticky header that toggles between general overview stats (Streak, XP, Hearts) and active quiz mode (Close button, smooth progress bar, and Hearts).

### 3. Quiz Component & Interactive States (`src/components/quiz/`)
- **`QuizOption`**: Multiple choice option button supporting 5 distinct visual states:
  1. `idle`: Clean neutral border with letter badge (`A`, `B`, `C`, `D`) and keyboard shortcut badge.
  2. `selected`: Vibrant sky-blue highlight and border.
  3. `correct`: Emerald green styling with checkmark icon.
  4. `incorrect`: Ruby red styling with shake effect and X icon, while simultaneously revealing the correct answer in green.
  5. `disabled`: Faded state when evaluating.
- **`QuizFeedbackDrawer`**: Duolingo-style slide-up evaluation sheet:
  - *Correct*: Green banner, "Nicely done!", XP gain badge, explanation note, and continue button.
  - *Incorrect*: Red banner, "Not quite!", correct answer callout, explanation note, `-1 Heart` badge, and continue button.
- **`OutOfHeartsModal`**: Modal triggered when hearts reach 0, offering options to refill or exit.
- **`QuizComponent`**: Full orchestrator combining question prompt, option selection, checking answer, celebratory confetti particle burst, and sound/explanation transitions.

### 4. Cards & Progression (`src/components/cards/`)
- **`TopicCard`**: Displays course modules (e.g. *Computer Hardware*, *Computer Software*), key terms preview, percentage progress bar, and action button.
- **`LevelCard`**: Difficulty level cards (Level 1: Easy, Level 2: Medium, Level 3: Hard) with locked/unlocked states, XP reward tags, and star ratings.

---

## 🎛️ Dual-Mode Explorer

The application features a toggle at the top navigation bar:
1. **Reusable Components & States**: An interactive playground where you can test every button variant, trigger heart losses, add XP, change streak counts, toggle quiz option states in isolation, and test live questions.
2. **Full App Quest Flow**: An end-to-end playable simulation following the user flow (Home ➔ Topic Map ➔ Level Select ➔ Quiz ➔ Results ➔ Leaderboard).

---

## 📚 Ready for IST1020 Lecture Notes

The question engine is structured around the `QuizData` schema in `src/types/quiz.ts` and `src/data/quizData.ts`. When you upload your IST1020 lecture notes, new topics, concepts, key terms, and question banks can be added directly or automatically mapped into the topics array.
