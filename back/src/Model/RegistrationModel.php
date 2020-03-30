<?php

declare(strict_types=1);

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class RegistrationModel
{
    /**
     * @var string|null
     * @Assert\Email()
     */
    private $email;

    /**
     * @var string|null
     * @Assert\Length(min="4")
     */
    private $password;

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return strtolower($this->email);
    }

    /**
     * @param string|null $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * @param string|null $password
     * @return self
     */
    public function setPassword(?string $password): self
    {
        $this->password = $password;
        return $this;
    }
}
