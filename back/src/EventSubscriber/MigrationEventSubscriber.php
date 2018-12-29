<?php

namespace App\EventSubscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Tools\Event\GenerateSchemaEventArgs;

class MigrationEventSubscriber implements EventSubscriber
{
    public function getSubscribedEvents()
    {
        return array(
            'postGenerateSchema',
        );
    }

    public function postGenerateSchema(GenerateSchemaEventArgs $Args)
    {
        $Schema = $Args->getSchema();

        if (! $Schema->hasNamespace('public')) {
            $Schema->createNamespace('public');
        }

        if (! $Schema->hasNamespace('topology')) {
            $Schema->createNamespace('topology');
        }

        if (! $Schema->hasNamespace('tiger')) {
            $Schema->createNamespace('tiger');
        }

        if (! $Schema->hasNamespace('tiger_data')) {
            $Schema->createNamespace('tiger_data');
        }
    }
}