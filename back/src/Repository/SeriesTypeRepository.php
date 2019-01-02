<?php

namespace App\Repository;

use App\Entity\Series;
use App\Entity\SeriesType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class SeriesTypeRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class SeriesTypeRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, SeriesType::class);
    }

    public function findOneById(int $id):? SeriesType
    {
        return $this
            ->createQueryBuilder('s')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
