<?php
/**
 * Autoload used classes.
 *
 * The function is responsible for autoloading classes based on their namespace and naming convention.
 *
 * @param string $className The fully qualified class name to load.
 *
 * @throws Exception If the class file is not found or not readable.
 *
 * @author Odera Anakpe
 */
function autoloader($className)
{
    $fileName = $className . ".php";
    $fileName = str_replace('\\', DIRECTORY_SEPARATOR, $fileName);

    if (!is_readable($fileName)) {
        throw new Exception("File '$fileName' not found");
    }

    require $fileName;
}