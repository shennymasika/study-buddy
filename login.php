<?php
// login.php — Gamified Login & Registration UI and API Endpoint for Study Buddy
session_start();
require_once __DIR__ . '/db.php';

// Check if request is JSON API call
$isJsonRequest = (
    (isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) ||
    (isset($_GET['format']) && $_GET['format'] === 'json')
);

// If already logged in and it's a browser GET request, redirect to index.php
if (isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['action'])) {
    header('Location: index.php');
    exit;
}

$error = null;
$success = null;

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_destroy();
    if ($isJsonRequest) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        exit;
    }
    header('Location: login.php?logged_out=1');
    exit;
}

// Read input data (handles both $_POST and JSON php://input)
$input = $_POST;
if ($isJsonRequest) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}

// Process POST actions: login, register, or guest
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $input['action'] ?? 'login';

    if ($action === 'guest') {
        // Guest cadet session
        $_SESSION['user_id'] = 999;
        $_SESSION['student_id'] = 'GUEST_' . substr(md5(uniqid()), 0, 6);
        $_SESSION['username'] = 'Cadet Guest';
        $_SESSION['email'] = 'guest@studybuddy.local';
        $_SESSION['xp'] = 50;
        $_SESSION['streak'] = 1;
        $_SESSION['hearts'] = 5;

        if ($isJsonRequest) {
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Guest session initialized',
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'student_id' => $_SESSION['student_id'],
                    'username' => $_SESSION['username'],
                    'xp' => $_SESSION['xp'],
                    'streak' => $_SESSION['streak'],
                    'hearts' => $_SESSION['hearts'],
                ]
            ]);
            exit;
        }

        header('Location: index.php');
        exit;
    }

    if ($action === 'register') {
        $username = trim($input['username'] ?? '');
        $studentId = trim($input['student_id'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($username) || empty($studentId) || empty($email) || empty($password)) {
            $error = 'Please fill in all registration fields.';
        } else {
            $db = getDB();
            if ($db) {
                try {
                    // Check if student ID or email exists
                    $check = $db->prepare("SELECT id FROM users WHERE student_id = ? OR email = ?");
                    $check->execute([$studentId, $email]);
                    if ($check->fetch()) {
                        $error = 'A student with this ID or Email already exists.';
                    } else {
                        $hash = password_hash($password, PASSWORD_BCRYPT);
                        $stmt = $db->prepare("INSERT INTO users (student_id, username, email, password_hash, xp, streak, hearts) VALUES (?, ?, ?, ?, 0, 0, 5)");
                        $stmt->execute([$studentId, $username, $email, $hash]);
                        $newId = $db->lastInsertId();

                        $_SESSION['user_id'] = $newId;
                        $_SESSION['student_id'] = $studentId;
                        $_SESSION['username'] = $username;
                        $_SESSION['email'] = $email;
                        $_SESSION['xp'] = 0;
                        $_SESSION['streak'] = 0;
                        $_SESSION['hearts'] = 5;

                        if ($isJsonRequest) {
                            header('Content-Type: application/json');
                            echo json_encode([
                                'success' => true,
                                'message' => 'Account created successfully',
                                'user' => [
                                    'id' => $newId,
                                    'student_id' => $studentId,
                                    'username' => $username,
                                    'xp' => 0,
                                    'streak' => 0,
                                    'hearts' => 5,
                                ]
                            ]);
                            exit;
                        }

                        header('Location: index.php');
                        exit;
                    }
                } catch (Exception $e) {
                    $error = 'Database registration error: ' . $e->getMessage();
                }
            } else {
                // Mock session registration if MySQL is not active
                $_SESSION['user_id'] = 101;
                $_SESSION['student_id'] = $studentId;
                $_SESSION['username'] = $username;
                $_SESSION['email'] = $email;
                $_SESSION['xp'] = 0;
                $_SESSION['streak'] = 0;
                $_SESSION['hearts'] = 5;

                if ($isJsonRequest) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'message' => 'Account created (session mode)', 'user' => $_SESSION]);
                    exit;
                }

                header('Location: index.php');
                exit;
            }
        }
    }

    if ($action === 'login') {
        $identifier = trim($input['identifier'] ?? $input['email'] ?? $input['student_id'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($identifier) || empty($password)) {
            $error = 'Please provide both student ID/email and password.';
        } else {
            $db = getDB();
            $authenticated = false;
            $userData = null;

            if ($db) {
                try {
                    $stmt = $db->prepare("SELECT * FROM users WHERE student_id = ? OR email = ? LIMIT 1");
                    $stmt->execute([$identifier, $identifier]);
                    $user = $stmt->fetch();

                    if ($user && password_verify($password, $user['password_hash'])) {
                        $authenticated = true;
                        $userData = $user;
                    }
                } catch (Exception $e) {
                    $error = 'Database error: ' . $e->getMessage();
                }
            }

            // Fallback for demo credentials if DB is offline or mock login
            if (!$authenticated && ($identifier === 'STU1020' || $identifier === 'student@studybuddy.edu') && $password === 'password123') {
                $authenticated = true;
                $userData = [
                    'id' => 1,
                    'student_id' => 'STU1020',
                    'username' => 'Cadet Student',
                    'email' => 'student@studybuddy.edu',
                    'xp' => 120,
                    'streak' => 3,
                    'hearts' => 5,
                ];
            }

            if ($authenticated && $userData) {
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['student_id'] = $userData['student_id'];
                $_SESSION['username'] = $userData['username'];
                $_SESSION['email'] = $userData['email'];
                $_SESSION['xp'] = (int)($userData['xp'] ?? 0);
                $_SESSION['streak'] = (int)($userData['streak'] ?? 0);
                $_SESSION['hearts'] = (int)($userData['hearts'] ?? 5);

                if ($isJsonRequest) {
                    header('Content-Type: application/json');
                    echo json_encode([
                        'success' => true,
                        'message' => 'Logged in successfully',
                        'user' => [
                            'id' => $_SESSION['user_id'],
                            'student_id' => $_SESSION['student_id'],
                            'username' => $_SESSION['username'],
                            'xp' => $_SESSION['xp'],
                            'streak' => $_SESSION['streak'],
                            'hearts' => $_SESSION['hearts'],
                        ]
                    ]);
                    exit;
                }

                header('Location: index.php');
                exit;
            } else {
                $error = 'Invalid Student ID / Email or Password.';
            }
        }
    }

    if ($isJsonRequest && $error) {
        header('Content-Type: application/json', true, 401);
        echo json_encode(['success' => false, 'error' => $error]);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login • Study Buddy - Computer Studies Quest</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Nunito', system-ui, sans-serif;
    }
    .btn-3d {
      transition: transform 0.08s ease, box-shadow 0.08s ease;
    }
    .btn-3d:active {
      transform: translateY(3px);
      box-shadow: none !important;
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col justify-between p-4">
  <div class="max-w-md w-full mx-auto my-auto pt-6 pb-8">
    
    <!-- App Brand Header -->
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-400 to-sky-400 text-slate-900 shadow-md border-b-4 border-emerald-600 mb-3">
        <svg class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">Study Buddy</h1>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Computer Studies Quest (IST1020)</p>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-md">
      
      <!-- Tab Switcher -->
      <div class="flex items-center bg-slate-100 p-1 rounded-2xl mb-6">
        <button id="tab-login" onclick="switchTab('login')" class="flex-1 py-2 rounded-xl text-xs font-black transition-all bg-white text-slate-800 shadow-sm">
          Sign In
        </button>
        <button id="tab-register" onclick="switchTab('register')" class="flex-1 py-2 rounded-xl text-xs font-black transition-all text-slate-400 hover:text-slate-700">
          Create Account
        </button>
      </div>

      <!-- Alerts -->
      <?php if (!empty($error)): ?>
        <div class="mb-5 p-3.5 bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
          <span><?= htmlspecialchars($error) ?></span>
        </div>
      <?php endif; ?>

      <?php if (isset($_GET['logged_out'])): ?>
        <div class="mb-5 p-3.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          <span>You have been safely logged out.</span>
        </div>
      <?php endif; ?>

      <!-- 1. LOGIN FORM -->
      <form id="form-login" method="POST" action="login.php" class="space-y-4">
        <input type="hidden" name="action" value="login">
        
        <div>
          <label class="block text-xs font-black text-slate-600 uppercase mb-1.5">Student ID or Email</label>
          <input 
            type="text" 
            name="identifier" 
            placeholder="e.g. STU1020 or student@studybuddy.edu" 
            required 
            class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-black text-slate-600 uppercase">Password</label>
            <span class="text-[11px] font-bold text-slate-400">Demo: password123</span>
          </div>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            required 
            class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <button 
          type="submit" 
          class="btn-3d w-full mt-2 py-3.5 bg-[#58cc02] hover:bg-[#52be02] text-white font-extrabold text-base rounded-2xl border-b-4 border-[#46a302] shadow-sm select-none"
        >
          Sign In to Quest
        </button>
      </form>

      <!-- 2. REGISTER FORM -->
      <form id="form-register" method="POST" action="login.php" class="space-y-3.5 hidden">
        <input type="hidden" name="action" value="register">

        <div>
          <label class="block text-xs font-black text-slate-600 uppercase mb-1">Full Name</label>
          <input 
            type="text" 
            name="username" 
            placeholder="e.g. Jane Doe" 
            required 
            class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 uppercase mb-1">Student ID</label>
          <input 
            type="text" 
            name="student_id" 
            placeholder="e.g. STU1021" 
            required 
            class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 uppercase mb-1">Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="student@university.edu" 
            required 
            class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 uppercase mb-1">Choose Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            required 
            class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
        </div>

        <button 
          type="submit" 
          class="btn-3d w-full mt-2 py-3.5 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold text-base rounded-2xl border-b-4 border-[#147eb2] shadow-sm select-none"
        >
          Create Cadet Profile
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6 text-center">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
        <span class="relative px-3 bg-white text-xs font-black text-slate-400 uppercase">Or play instantly</span>
      </div>

      <!-- Guest Login Quick Button -->
      <form method="POST" action="login.php">
        <input type="hidden" name="action" value="guest">
        <button 
          type="submit" 
          class="btn-3d w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl border-2 border-slate-200 border-b-4 border-b-slate-300 transition-all flex items-center justify-center gap-2 select-none"
        >
          <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <span>Continue as Guest Cadet</span>
        </button>
      </form>

    </div>

    <!-- Backend Status Pill -->
    <div class="mt-4 text-center">
      <?php if (isDBConnected()): ?>
        <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          MySQL Database Connected
        </span>
      <?php else: ?>
        <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full" title="MySQL offline: using session-based storage">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          Session Storage Mode (MySQL optional)
        </span>
      <?php endif; ?>
    </div>

  </div>

  <script>
    function switchTab(mode) {
      const loginTab = document.getElementById('tab-login');
      const registerTab = document.getElementById('tab-register');
      const loginForm = document.getElementById('form-login');
      const registerForm = document.getElementById('form-register');

      if (mode === 'login') {
        loginTab.className = "flex-1 py-2 rounded-xl text-xs font-black transition-all bg-white text-slate-800 shadow-sm";
        registerTab.className = "flex-1 py-2 rounded-xl text-xs font-black transition-all text-slate-400 hover:text-slate-700";
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        registerTab.className = "flex-1 py-2 rounded-xl text-xs font-black transition-all bg-white text-slate-800 shadow-sm";
        loginTab.className = "flex-1 py-2 rounded-xl text-xs font-black transition-all text-slate-400 hover:text-slate-700";
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      }
    }
  </script>
</body>
</html>
