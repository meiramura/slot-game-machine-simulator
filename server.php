<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$a = rand(1, 5);
sleep($a);
echo json_encode(['delay' => $a]);
?> 