<?php

namespace App\Service;

use App\Entity\Asset;
use Elastica\Document;

class AssetIndexerService
{
    public function buildDocument(Asset $asset)
    {
        return new Document(
            $asset->getId(), // Manually defined ID
            [
                'id'   => $asset->getId(),
                'name' => $asset->getName(),
                'code' => $asset->getCode(),
            ],
            "assets" // Types are deprecated, to be removed in Elastic 7
        );
    }

}