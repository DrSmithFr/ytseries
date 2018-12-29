<?php

namespace App\Repository;

use App\Entity\Season;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class SeasonRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class SeasonRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Season::class);
    }

    /**
     * @return int
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function countAll(): int
    {
        $count = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(s) as seasons')
            ->from(Season::class, 's')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }
}
