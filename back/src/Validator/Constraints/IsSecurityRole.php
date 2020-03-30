<?php

declare(strict_types = 1);

namespace App\Validator\Constraints;

use App\Enum\SecurityRoleEnum;

/**
 * @Annotation
 */
class IsSecurityRole extends IsEnum
{
    /**
     * @return string|null
     */
    public function getEnumClass(): string
    {
        return SecurityRoleEnum::class;
    }
}
