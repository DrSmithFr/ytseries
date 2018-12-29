<?php

namespace App\Enum;

final class SecurityRoleEnum extends Enum
{
    const USER        = 'ROLE_USER';
    const ADMIN       = 'ROLE_ADMIN';
    const SUPER_ADMIN = 'ROLE_SUPER_ADMIN';

    public static function isValidRole(string $role): bool
    {
        return parent::isValidValue($role);
    }
}
