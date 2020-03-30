<?php

declare(strict_types=1);

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterModel
{
    /**
     * @var string|null
     * @Assert\NotBlank()
     */
    private $username;

    /**
     * @var string|null
     * @Assert\Length(min="4")
     */
    private $password;

    /**
     * @var string|null
     */
    private $coupon;

    /**
     * @return string|null
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * @param string|null $username
     *
     * @return self
     */
    public function setUsername(?string $username): self
    {
        $this->username = $username;
        return $this;
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

    /**
     * @return string|null
     */
    public function getCoupon(): ?string
    {
        return $this->coupon;
    }

    /**
     * @param string|null $coupon
     */
    public function setCoupon(?string $coupon): void
    {
        $this->coupon = $coupon;
    }
}
