# Study Buddy — Computer Studies Quest (IST1020)

Gamified learning application for IST1020 Computer Studies, featuring Duolingo-style game mechanics with tactile 3D elements, hearts/XP/streak systems, interactive question evaluation states, and a complete PHP & MySQL backend with session-protected routing.

---

## 🚀 Quick Start

### 1. Frontend Development (Vite)
To work on frontend components with instant Hot-Module-Replacement:

```bash
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```
Open `http://localhost:5173` in your browser.

---

### 2. Backend Development (PHP & MySQL)
The project includes a complete PHP backend architecture for user authentication, session protection, and progress persistence:

- **[`login.php`](file:///c:/Users/Administrator/OneDrive/Documents/Study%20buddy%20app/login.php)**: 
  - Dual-mode: Gamified Login, Registration & Guest Entry UI matching the Study Buddy design, plus a JSON API endpoint (`POST /login.php`) for programmatic authentication.
- **[`index.php`](file:///c:/Users/Administrator/OneDrive/Documents/Study%20buddy%20app/index.php)**: 
  - Protected main entry point. Verifies active PHP session (`$_SESSION['user_id']`), redirects unauthenticated users to `login.php`, injects user data (`window.PHP_USER`) into the frontend, and provides REST sync endpoints (`?api=me` and `?api=save`).
- **[`logout.php`](file:///c:/Users/Administrator/OneDrive/Documents/Study%20buddy%20app/logout.php)**: 
  - Cleanly destroys the PHP session and redirects back to `login.php`.
- **[`db.php`](file:///c:/Users/Administrator/OneDrive/Documents/Study%20buddy%20app/db.php)**: 
  - MySQL PDO connector that automatically initializes the `study_buddy` database and `users` table if they don't already exist. Includes automatic fallback to mock session storage if MySQL is temporarily offline.
- **[`index.html`](file:///c:/Users/Administrator/OneDrive/Documents/Study%20buddy%20app/index.html)**: 
  - Vite SPA root template for frontend development and building into `dist/`.

#### How to run with PHP / XAMPP:
1. **With XAMPP / WampServer**:
   - Copy or symlink this folder to your `htdocs` directory (e.g., `C:/xampp/htdocs/study-buddy/`).
   - Start Apache and MySQL in your XAMPP Control Panel.
   - Open `http://localhost/study-buddy/login.php` or `http://localhost/study-buddy/index.php` in your browser.
   - **Default Demo Credentials**:
     - **Student ID**: `STU1020` (or `student@studybuddy.edu`)
     - **Password**: `password123`
2. **With PHP Built-in Server**:
   ```bash
   php -S localhost:8000
   ```
   Open `http://localhost:8000/login.php` in your browser.

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

## 🎛️ Dual-Mode Frontend Explorer

The frontend features a top navigation toggle:
1. **Reusable Components & States**: An interactive playground where you can test every button variant, trigger heart losses, add XP, change streak counts, toggle quiz option states in isolation, and test live questions.
2. **Full App Quest Flow**: An end-to-end playable simulation following the user flow (Home ➔ Topic Map ➔ Level Select ➔ Quiz ➔ Results ➔ Leaderboard).
