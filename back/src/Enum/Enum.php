<?php

declare(strict_types = 1);

namespace App\Enum;

use ReflectionClass;
use ReflectionException;
use Doctrine\DBAL\Types\Type;
use InvalidArgumentException;
use Doctrine\DBAL\Platforms\SqlitePlatform;
use SebastianBergmann\Type\RuntimeException;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Platforms\SQLServerPlatform;
use Doctrine\DBAL\Platforms\PostgreSqlPlatform;

abstract class Enum extends Type
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

    /**
     * @param AbstractPlatform $platform
     * @param array            $fieldDeclaration
     *
     * @return string
     */
    public function getSqlDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        // wrapping values
        $values = array_map(function($val) { return "'".$val."'"; }, self::getAll());

        switch (true) {
            case $platform instanceof SqlitePlatform:
                $sqlDeclaration = sprintf(
                    'TEXT CHECK(%s IN (%s))',
                    $fieldDeclaration['name'],
                    implode(", ", $values)
                );
                break;
            case $platform instanceof PostgreSqlPlatform:
            case $platform instanceof SQLServerPlatform:
                $sqlDeclaration = sprintf(
                    'VARCHAR(255) CHECK(%s IN (%s))',
                    $fieldDeclaration['name'],
                    implode(", ", $values)
                );

                break;
            default:
                $sqlDeclaration = sprintf('ENUM(%s)', implode(", ", $values));
        }

        return $sqlDeclaration;
    }

    /**
     * @param mixed            $value
     * @param AbstractPlatform $platform
     *
     * @return mixed
     */
    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        return $value;
    }

    /**
     * @param AbstractPlatform $platform
     * @param mixed            $value
     *
     * @return mixed
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if (!in_array($value, self::getAll())) {
            throw new InvalidArgumentException(sprintf("Invalid '%s' value.", $this->getName()));
        }
        return $value;
    }

    /**
     * Return the ClassName without namespace prefix
     *
     * @return string
     */
    public function getName()
    {
        try {
            $refection = new ReflectionClass($this);
            return $refection->getShortName();
        } catch (ReflectionException $e) {
            // avoid throwing reflection exception
            throw new RuntimeException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
