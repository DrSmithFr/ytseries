<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Series;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class SerieRepository
 *
 * @package App\Repository
 * @codeCoverageIgnore
 */
class SeriesRepository extends ServiceEntityRepository
{
    /**
     * UserRepository constructor.
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Series::class);
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
            ->select('count(s) as series')
            ->from(Series::class, 's')
            ->getQuery()
            ->getSingleScalarResult();

        return (int)$count;
    }

    /**
     * @param int|null $id
     * @return Series|null
     * @throws NonUniqueResultException
     */
    public function getFullyLoadedSeriesById(?int $id): ?Series
    {
        if (null === $id) {
            return null;
        }

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->addSelect('series')
            ->addSelect('type')
            ->addSelect('season')
            ->addSelect('episode')
            ->addSelect('category')
            ->from(Series::class, 'series')
            ->leftJoin('series.type', 'type')
            ->leftJoin('series.seasons', 'season')
            ->leftJoin('season.episodes', 'episode')
            ->leftJoin('series.categories', 'category')
            ->where('series.id = :id')
            ->setParameter('id', $id)
            ->addOrderBy('season.rank', 'ASC')
            ->addOrderBy('episode.rank', 'ASC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string|null $importCode
     * @return Series|null
     * @throws NonUniqueResultException
     */
    public function getFullyLoadedSeriesByImportCode(?string $importCode): ?Series
    {
        if (null === $importCode) {
            return null;
        }

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->addSelect('series')
            ->addSelect('type')
            ->addSelect('season')
            ->addSelect('episode')
            ->addSelect('category')
            ->from(Series::class, 'series')
            ->leftJoin('series.type', 'type')
            ->leftJoin('series.seasons', 'season')
            ->leftJoin('season.episodes', 'episode')
            ->leftJoin('series.categories', 'category')
            ->where('series.importCode = :importCode')
            ->setParameter('importCode', $importCode)
            ->addOrderBy('season.rank', 'ASC')
            ->addOrderBy('episode.rank', 'ASC')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param int $id
     * @return Series|null
     * @throws NonUniqueResultException
     */
    public function findOneById(int $id): ?Series
    {
        return $this
            ->createQueryBuilder('s')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $importCode
     * @return Series|null
     * @throws NonUniqueResultException
     */
    public function findOneByImportCode(string $importCode): ?Series
    {
        return $this
            ->createQueryBuilder('s')
            ->where('s.importCode = :importCode')
            ->setParameter('importCode', $importCode)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
