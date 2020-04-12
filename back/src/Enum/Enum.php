<?php

declare(strict_types = 1);

namespace App\Enum;

use ReflectionClass;
use RuntimeException;
use ReflectionException;
use InvalidArgumentException;
use Doctrine\DBAL\Platforms\SqlitePlatform;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Platforms\SQLServerPlatform;
use Doctrine\DBAL\Platforms\PostgreSqlPlatform;

abstract class Enum
{
    /**
     * @var array
     */
    private static $constCacheArray;

    /**
     * @return array
     */
    public static function getAll(): array
    {
        if (self::$constCacheArray === null) {
            self::$constCacheArray = [];
        }

        $calledClass = get_called_class();

        if (!array_key_exists($calledClass, self::$constCacheArray)) {
            try {
                $current = new ReflectionClass($calledClass);

                self::$constCacheArray[$calledClass] = array_diff(
                    $current->getConstants(),
                    $current->getParentClass()->getConstants()
                );
            } catch (ReflectionException $e) {
                // avoid throwing reflection exception
                throw new RuntimeException($e->getMessage(), $e->getCode(), $e);
            }
        }

        return self::$constCacheArray[$calledClass];
    }

    /**
     * @param string $name
     *
     * @return bool
     */
    public static function isValidName(string $name): bool
    {
        $constants = self::getAll();
        return array_key_exists($name, $constants);
    }

    /**
     * @param string $value
     *
     * @return bool
     */
    public static function isValidValue(string $value): bool
    {
        $values = array_values(self::getAll());
        return in_array($value, $values, true);
    }
}
