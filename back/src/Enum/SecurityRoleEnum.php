<?php

declare(strict_types=1);

namespace App\Enum;

use ReflectionException;

final class SecurityRoleEnum extends Enum
{
    public const ADMIN = 'ROLE_ADMIN';

    /**
     * @param string $role
     * @return bool
     */
    public static function isValidRole(string $role): bool
    {
        return parent::isValidValue($role);
    }
}
