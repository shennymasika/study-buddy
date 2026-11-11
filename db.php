<?php
// db.php — Database configuration and initialization for Study Buddy backend

$host = 'localhost';
$dbname = 'study_buddy';
$username = 'root';
$password = '';

$db = null;
$db_error = null;
$db_connected = false;

try {
    // Attempt connection to MySQL server
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Create database if it does not exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");

    // Create users table if it does not exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `student_id` VARCHAR(50) UNIQUE NOT NULL,
        `username` VARCHAR(100) NOT NULL,
        `email` VARCHAR(150) UNIQUE NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `xp` INT DEFAULT 0,
        `streak` INT DEFAULT 0,
        `hearts` INT DEFAULT 5,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insert default demo student if table is empty
    $checkUser = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
    if ($checkUser == 0) {
        $demoPass = password_hash('password123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO `users` (student_id, username, email, password_hash, xp, streak, hearts) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['STU1020', 'Cadet Student', 'student@studybuddy.edu', $demoPass, 120, 3, 5]);
    }

    $db = $pdo;
    $db_connected = true;
} catch (PDOException $e) {
    // Fallback: If MySQL is not running (e.g. XAMPP MySQL turned off), fallback gracefully
    $db_error = $e->getMessage();
    $db_connected = false;
}

/**
 * Helper to get DB connection or null
 */
function getDB() {
    global $db;
    return $db;
}

/**
 * Helper to check if DB is connected
 */
function isDBConnected() {
    global $db_connected;
    return $db_connected;
}
