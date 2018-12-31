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

        $episodes = [];
        foreach ($series->getSeasons() as $season) {
            foreach ($season->getEpisodes() as $episode) {
                $episodes[] = $episode;
            }
        }

        return new Document(
            $series->getId(), // Manually defined ID
            [
                'id'          => $series->getId(),
                'name'        => $series->getName(),
                'image'       => $series->getImage() ?? '',
                'description' => $series->getDescription(),
                'seasons'     => $series->getSeasons()->count(),
                'episodes'    => count($episodes),
            ],
            "series" // Types are deprecated, to be removed in Elastic 7
        );
    }

}