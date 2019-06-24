<?php

function generateRandomString($length = 10) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, 61)];
  }
  return $randomString;
}

switch ($_SERVER['REQUEST_METHOD']) {
  case 'GET':
    header("Location: /flashme/");
    break;
  
  case 'POST':
    $data = file_get_contents('php://input');
    
    if (isset($_GET["id"])) $rnd = $_GET["id"];
    else $rnd = generateRandomString(15);

    file_put_contents("./$rnd", $data);
    header("Content-Type: application/json");
    echo("{ \"id\": \"$rnd\" }");
    break;
}