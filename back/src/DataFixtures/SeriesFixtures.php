<?php

namespace App\DataFixtures;

use App\Entity\Series;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class SeriesFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class SeriesFixtures extends Fixture
{
    const SERIES_PREVIEW = 'series-preview';

    public function load(ObjectManager $manager): void
    {
        $preview = new Series();

        $preview
            ->setName('Preview')
            ->setLocale('fr')
            ->setDescription(
                'Arthur est un Youtubeur célèbre sous pression qui n\'arrive plus à sortir de vidéo. ' .
                'Preview, une étrange fonctionnalité de la plateforme de vidéo, se propose de le relancer.'
            );

        $manager->persist($preview);

        $manager->flush();

        $this->addReference(self::SERIES_PREVIEW, $preview);
    }
}
