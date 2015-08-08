<?php
ini_set("display_errors", 1);
error_reporting(E_ALL & ~E_NOTICE);

$content = $_GET["content"];
header("Content-type: text/calendar");
header("Content-length: ".strlen($content));
header("Content-disposition: attachment; filename=event.ics");
echo $content;
?>