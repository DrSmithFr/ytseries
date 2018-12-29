<?php

namespace App\Repository;

use App\Entity\Serie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class SerieRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class SeriesRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Serie::class);
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
            ->select('count(s) as series')
            ->from(Serie::class, 's')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }
}
