<?php

namespace App\Service;

use App\Entity\Asset;
use App\Entity\Series;
use App\Repository\SeriesRepository;
use Elastica\Document;

class IndexerService
{
    /**
     * @var SeriesRepository
     */
    private $repository;

    public function __construct(SeriesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function buildSeriesDocument(Series $series)
    {
        $series = $this->repository->getFullyLoadedSeriesById($series->getId());

        return new Document(
            $series->getId(), // Manually defined ID
            [
                'id'   => $series->getId(),
                'name' => $series->getName(),
                'description' => $series->getDescription(),
                'season' => $series->getSeasons()->count()
            ],
            "series" // Types are deprecated, to be removed in Elastic 7
        );
    }

}