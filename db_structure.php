<?php
// db_structure.php - Important Tables Only
$host = '127.0.0.1';
$db   = 'emeahub';
$user = 'emeauser';       // your DB user
$pass = 'strongpassword'; // your DB password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$importantTables = [
    'users',
    'departments',
    'subjects',
    'modules',
    'resources',
    'achievements',
    'user_achievements',
    'ratings',
    'leaderboards',
    'timetables',
    'contribution_logs',
    'downloads'
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>DB Structure</title>';
    echo '<style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; display:flex; justify-content:center; }
        .wrapper { max-width: 800px; width: 100%; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 40px; }
        th, td { border: 1px solid #555; padding: 8px; text-align: left; width:33%; word-break: break-word; }
        th { background: #eee; }
        h2 { margin-top: 40px; color: #333; }
    </style></head><body><div class="wrapper">';

    foreach ($importantTables as $table) {
        echo "<h2>Table: $table</h2>";
        echo '<table>';
        echo '<tr><th>Field Name</th><th>Data Type</th><th>Constraints</th></tr>';

        $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
        $stmt->execute();
        $columns = $stmt->fetchAll();

        foreach ($columns as $col) {
            $constraints = [];
            if ($col['Null'] === 'NO') $constraints[] = 'NOT NULL';
            if (!empty($col['Key'])) $constraints[] = $col['Key'];
            if (!is_null($col['Default'])) $constraints[] = 'DEFAULT '.$col['Default'];
            if (!empty($col['Extra'])) $constraints[] = $col['Extra'];

            $constraintsStr = implode(', ', $constraints);
            echo "<tr>
                <td>{$col['Field']}</td>
                <td>{$col['Type']}</td>
                <td>$constraintsStr</td>
            </tr>";
        }

        echo '</table>';
    }

    echo '</div></body></html>';

} catch (\PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
}