<?php

namespace App\Enum;

abstract class Enum
{
    /**
     * @var array
     */
    private static $constCacheArray = null;

    /**
     * Enum constructor.
     * @codeCoverageIgnore
     */
    private function __construct()
    {
        // disallow Enum creation
    }

    /**
     * @return array
     */
    public static function getAll(): array
    {
        if (self::$constCacheArray == null) {
            self::$constCacheArray = [];
        }

        $calledClass = get_called_class();

        if (!array_key_exists($calledClass, self::$constCacheArray)) {
            $reflect                             = new \ReflectionClass($calledClass);
            self::$constCacheArray[$calledClass] = $reflect->getConstants();
        }

        return self::$constCacheArray[$calledClass];
    }

    /**
     * @param mixed $name
     * @return bool
     */
    public static function isValidName(string $name): bool
    {
        $constants = self::getAll();
        return array_key_exists($name, $constants);
    }

    /**
     * @param mixed $value
     * @return bool
     */
    public static function isValidValue(string $value): bool
    {
        $values = array_values(self::getAll());
        return in_array($value, $values, true);
    }
}
