<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use App\Model\UserCounterModel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class UserRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class UserRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @param string $apiKey
     * @return User|null
     * @throws NonUniqueResultException
     */
    public function getUserByApiKey(string $apiKey): ?User
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('u')
            ->from(User::class, 'u')
            ->where('u.apiKey = :apiKey')
            ->setParameter('apiKey', $apiKey)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $username
     * @return User|null
     * @throws NonUniqueResultException
     */
    public function getUserByUsername(string $username): ?User
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('u')
            ->from(User::class, 'u')
            ->where('u.username = :username')
            ->setParameter('username', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $token
     * @return User|null
     * @throws NonUniqueResultException
     */
    public function getUserByPasswordResetToken(string $token): ?User
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('u')
            ->from(User::class, 'u')
            ->where('u.confirmationToken = :token')
            ->setParameter('token', $token)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @return UserCounterModel
     * @throws NonUniqueResultException
     */
    public function getUserCounter(): UserCounterModel
    {
        return (new UserCounterModel())
            ->setTotal($this->countAll())
            ->setActive(1);
    }

    /**
     * @return int
     * @throws NonUniqueResultException
     */
    public function countAll(): int
    {
        $count = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(u) as users')
            ->from(User::class, 'u')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }

    /**
     * @return int
     * @throws NonUniqueResultException
     */
    public function getActiveCount(): int
    {
        $count = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(u) as users')
            ->from(User::class, 'u')
            ->where('u.enabled = true')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }
}
