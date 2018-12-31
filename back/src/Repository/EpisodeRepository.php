<?php

namespace App\Repository;

use App\Entity\Episode;
use App\Entity\Series;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class EpisodeRepository
 * @package App\Repository
 * @codeCoverageIgnore
 */
class EpisodeRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Episode::class);
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
            ->select('count(e) as episodes')
            ->from(Episode::class, 'e')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }

    public function findOneBySeriesAndId(Series $series, int $id):? Episode
    {
        return $this
            ->createQueryBuilder('episode')
            ->join('episode.season', 'season')
            ->join('season.series', 'series')
            ->where('series = :series')
            ->andWhere('episode.id = :id')
            ->setParameters(
                [
                    'series' => $series,
                    'id' => $id
                ]
            )
            ->getQuery()
            ->getOneOrNullResult();
    }
}
