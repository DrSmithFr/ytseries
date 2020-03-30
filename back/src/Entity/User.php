<?php

declare(strict_types = 1);

namespace App\Entity;

use DateTime;
use InvalidArgumentException;
use Ramsey\Uuid\UuidInterface;
use App\Enum\SecurityRoleEnum;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use App\Entity\Traits\BlameableTrait;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Doctrine\Common\Collections\Collection;
use App\Entity\Interfaces\SerializableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @JMS\ExclusionPolicy("all")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(
 *     uniqueConstraints={
 *        @UniqueConstraint(
 *            columns={"validation_token"},
 *            options={"where": "validation_token IS NOT NULL"}
 *        ),
 *     }
 * )
 */
class User implements UserInterface, SerializableEntity
{
    use TimestampableTrait;
    use BlameableTrait;

    /**
     * @var int|null
     * @ORM\Id
     * @ORM\Column(type="integer", unique=true)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var UuidInterface|null
     * @JMS\Type("string")
     * @ORM\Column(type="uuid", unique=true)
     */
    private $uuid;

    /**
     * @var string|null
     * @JMS\Expose()
     * @JMS\Type("string")
     * @ORM\Column(type="string", unique=true)
     */
    private $username;

    /**
     * @var UuidInterface|null
     * @ORM\Column(type="uuid", nullable=true)
     */
    private $validationToken;

    /**
     * @var DateTime|null
     * @JMS\Expose()
     * @JMS\Type("datetime<'Y-m-d H:i:s'>")
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $validatedAt;

    /**
     * @var string|null
     * @ORM\Column(type="string", name="password")
     */
    private $password;

    /**
     * @var string|null
     * @ORM\Column(type="string", name="salt", nullable=true)
     */
    private $salt;

    /**
     * Used internally for login and register form
     *
     * @var string|null
     */
    private $plainPassword;

    /**
     * @var string[]
     * @JMS\Expose()
     * @JMS\Type("array<string>")
     * @ORM\Column(type="json_array", name="roles")
     */
    private $roles = [];

    /**
     * @var Collection|Historic[]
     * @ORM\OneToMany(targetEntity="App\Entity\Historic", mappedBy="user", cascade={"remove"})
     */
    private $historics;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->historics = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getIdentifier(): string
    {
        if ($uuid = $this->getUuid()) {
            return $uuid->toString();
        }

        return 'undefined';
    }

    /**
     * @JMS\Expose()
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("uuid")
     * @JMS\Type("string")
     * @return string
     */
    public function getUuidString(): ?string
    {
        if ($uuid = $this->getUuid()) {
            return $uuid->toString();
        }

        return null;
    }

    /**
     * @return string|null
     */
    public function getId(): ?string
    {
        return $this->id;
    }

    /**
     * @param string|null $id
     *
     * @return self
     */
    public function setId(?string $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return UuidInterface|null
     */
    public function getUuid(): ?UuidInterface
    {
        return $this->uuid;
    }

    /**
     * @param UuidInterface|null $uuid
     *
     * @return self
     */
    public function setUuid(?UuidInterface $uuid): self
    {
        $this->uuid = $uuid;
        return $this;
    }

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
        $this->username = strtolower($username);
        return $this;
    }

    /**
     * @return UuidInterface|null
     */
    public function getValidationToken(): ?UuidInterface
    {
        return $this->validationToken;
    }

    /**
     * @param UuidInterface|null $validationToken
     *
     * @return self
     */
    public function setValidationToken(?UuidInterface $validationToken): self
    {
        $this->validationToken = $validationToken;
        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getValidatedAt(): ?DateTime
    {
        return $this->validatedAt;
    }

    /**
     * @param DateTime|null $validatedAt
     *
     * @return self
     */
    public function setValidatedAt(?DateTime $validatedAt): self
    {
        $this->validatedAt = $validatedAt;
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
     *
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
    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    /**
     * @param string|null $plainPassword
     *
     * @return self
     */
    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getSalt(): ?string
    {
        return $this->salt;
    }

    /**
     * @param string|null $salt
     *
     * @return self
     */
    public function setSalt(?string $salt): self
    {
        $this->salt = $salt;
        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    /**
     * @param array $roles
     *
     * @return self
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @param string $role
     *
     * @return self
     */
    public function addRole(string $role): self
    {
        if (!SecurityRoleEnum::isValidValue($role)) {
            throw new InvalidArgumentException('invalid role');
        }

        if (!in_array($role, $this->roles)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    /**
     * @param string $role
     *
     * @return self
     */
    public function removeRole(string $role): self
    {
        if (!SecurityRoleEnum::isValidValue($role)) {
            throw new InvalidArgumentException('invalid role');
        }

        if (($key = array_search($role, $this->roles, true)) !== false) {
            array_splice($this->roles, $key, 1);
        }

        return $this;
    }


    /**
     * Removes sensitive data from the user.
     * This is important if, at any given point, sensitive information like
     * the plain-text password is stored on this object.
     */
    public function eraseCredentials(): void
    {
        $this->setPlainPassword(null);
    }
}
