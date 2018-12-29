<?php

namespace App\Service;

use App\Entity\Asset;
use App\Entity\Series;
use Elastica\Document;

class IndexerService
{
    public function buildSeriesDocument(Series $series)
    {
        return new Document(
            $series->getId(), // Manually defined ID
            [
                'id'   => $series->getId(),
                'name' => $series->getName(),
                'description' => $series->getDescription(),
            ],
            "series" // Types are deprecated, to be removed in Elastic 7
        );
    }

}