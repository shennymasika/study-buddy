<?php
// index.php — Protected Main Entry Point for Study Buddy PHP Backend
session_start();
require_once __DIR__ . '/db.php';

// 1. Session Protection Check
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$userId = $_SESSION['user_id'];
$studentId = $_SESSION['student_id'] ?? 'STU1020';
$username = $_SESSION['username'] ?? 'Cadet Student';
$email = $_SESSION['email'] ?? '';
$xp = (int)($_SESSION['xp'] ?? 0);
$streak = (int)($_SESSION['streak'] ?? 0);
$hearts = (int)($_SESSION['hearts'] ?? 5);

// 2. API Endpoints for Frontend Data Sync
if (isset($_GET['api'])) {
    header('Content-Type: application/json');

    // GET /index.php?api=me — returns current authenticated student info
    if ($_GET['api'] === 'me') {
        echo json_encode([
            'logged_in' => true,
            'user' => [
                'id' => $userId,
                'student_id' => $studentId,
                'username' => $username,
                'email' => $email,
                'xp' => $xp,
                'streak' => $streak,
                'hearts' => $hearts,
            ]
        ]);
        exit;
    }

    // POST /index.php?api=save — saves quiz progress (XP, streak, hearts)
    if ($_GET['api'] === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?? $_POST;

        $newXp = isset($payload['xp']) ? (int)$payload['xp'] : $xp;
        $newStreak = isset($payload['streak']) ? (int)$payload['streak'] : $streak;
        $newHearts = isset($payload['hearts']) ? (int)$payload['hearts'] : $hearts;

        // Update current session
        $_SESSION['xp'] = $newXp;
        $_SESSION['streak'] = $newStreak;
        $_SESSION['hearts'] = $newHearts;

        // Persist to MySQL if DB is active
        $db = getDB();
        if ($db && $userId !== 999) { // 999 is guest
            try {
                $stmt = $db->prepare("UPDATE users SET xp = ?, streak = ?, hearts = ? WHERE id = ?");
                $stmt->execute([$newXp, $newStreak, $newHearts, $userId]);
            } catch (Exception $e) {
                // Silently keep session updated
            }
        }

        echo json_encode([
            'success' => true,
            'message' => 'Progress saved to backend',
            'user' => [
                'id' => $userId,
                'student_id' => $studentId,
                'username' => $username,
                'xp' => $newXp,
                'streak' => $newStreak,
                'hearts' => $newHearts,
            ]
        ]);
        exit;
    }

    echo json_encode(['error' => 'Unknown API route']);
    exit;
}

// 3. Web Page Rendering
$distIndexPath = __DIR__ . '/dist/index.html';

if (file_exists($distIndexPath)) {
    $html = file_get_contents($distIndexPath);

    // Adjust relative asset paths for root index.php (assets are in ./dist/assets/)
    $html = str_replace('src="./assets/', 'src="./dist/assets/', $html);
    $html = str_replace('href="./assets/', 'href="./dist/assets/', $html);

    // Injected session bridge script
    $sessionBridge = '
    <script>
      window.PHP_USER = ' . json_encode([
          'id' => $userId,
          'student_id' => $studentId,
          'username' => $username,
          'email' => $email,
          'xp' => $xp,
          'streak' => $streak,
          'hearts' => $hearts,
      ]) . ';
    </script>
    ';

    // Injected top user status bar for PHP backend navigation
    $topUserBar = '
    <div style="background-color: #0f172a; color: #f8fafc; padding: 6px 16px; font-family: Nunito, system-ui, sans-serif; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1e293b; z-index: 9999; position: relative;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background: #22c55e; color: #022c22; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 900; text-transform: uppercase;">PHP Session</span>
        <span>Student: <strong>' . htmlspecialchars($username) . '</strong> (' . htmlspecialchars($studentId) . ')</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: #94a3b8;">XP: <strong style="color: #c084fc;">' . $xp . '</strong></span>
        <span style="color: #94a3b8;">Streak: <strong style="color: #fbbf24;">' . $streak . '</strong></span>
        <span style="color: #94a3b8;">Hearts: <strong style="color: #f87171;">' . $hearts . '/5</strong></span>
        <a href="logout.php" style="background: #ef4444; color: white; text-decoration: none; padding: 4px 10px; border-radius: 8px; font-weight: 800; border-bottom: 2px solid #b91c1c;">Log Out</a>
      </div>
    </div>
    ';

    // Inject session script into <head>
    $html = str_replace('</head>', $sessionBridge . '</head>', $html);
    // Inject user bar right after <body>
    $html = preg_replace('/<body([^>]*)>/i', '<body$1>' . $topUserBar, $html);

    echo $html;
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Study Buddy • Backend Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 font-['Nunito'] min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-3xl p-6 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-md text-center space-y-4">
    <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl">
      ✓
    </div>
    <h1 class="text-2xl font-black text-slate-800">Welcome, <?= htmlspecialchars($username) ?>!</h1>
    <p class="text-xs text-slate-500 font-bold">Student ID: <?= htmlspecialchars($studentId) ?> • Email: <?= htmlspecialchars($email) ?></p>

    <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
      <div>
        <span class="text-[10px] font-black text-slate-400 uppercase">XP</span>
        <p class="text-lg font-black text-purple-600"><?= $xp ?></p>
      </div>
      <div>
        <span class="text-[10px] font-black text-slate-400 uppercase">Streak</span>
        <p class="text-lg font-black text-amber-600"><?= $streak ?></p>
      </div>
      <div>
        <span class="text-[10px] font-black text-slate-400 uppercase">Hearts</span>
        <p class="text-lg font-black text-rose-600"><?= $hearts ?>/5</p>
      </div>
    </div>

    <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-left text-xs text-sky-800 space-y-1">
      <p class="font-bold">Next step for frontend compilation:</p>
      <p>Run <code class="bg-white px-1 py-0.5 rounded border border-sky-300 font-mono">npm run build</code> in the project directory to compile the Vite Study Buddy interface into <code class="font-mono">dist/</code>.</p>
    </div>

    <div class="pt-2">
      <a href="logout.php" class="inline-block w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm rounded-xl border-b-4 border-rose-700">
        Sign Out
      </a>
    </div>
  </div>
</body>
</html>
