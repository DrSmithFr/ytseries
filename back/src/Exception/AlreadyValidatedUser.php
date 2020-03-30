<?php


namespace App\Exception;

use Exception;

class AlreadyValidatedUser extends Exception
{
    /**
     * @var string|null
     */
    protected $message = 'user already validated';

    /**
     * @var int|null
     */
    protected $code = 1;
}
