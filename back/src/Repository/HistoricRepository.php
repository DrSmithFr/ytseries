<?php

namespace App\Repository;

use App\Entity\Historic;
use App\Entity\Series;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class HistoricRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class HistoricRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Historic::class);
    }

    public function getHistoricByUserAndSeries(User $user, Series $series):? Historic
    {
        return $this
            ->createQueryBuilder('h')
            ->where('h.user = :user')
            ->andWhere('h.series = :series')
            ->setParameters(
                [
                    'user'   => $user,
                    'series' => $series,
                ]
            )
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findAllByUser(User $user): array
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('historic')
            ->addSelect('series')
            ->from(Historic::class, 'historic')
            ->join('historic.series', 'series')
            ->where('historic.user = :user')
            ->setParameter('user', $user)
            ->orderBy('historic.updatedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
