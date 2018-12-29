<?php

namespace App\DataFixtures;

use App\Entity\Season;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class SeasonFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class SeasonFixtures extends Fixture implements DependentFixtureInterface
{
    const SEASON_PREVIEW_1 = 'series-preview-s1';

    public function load(ObjectManager $manager): void
    {
        $preview = new Season();

        $preview
            ->setSeries($this->getReference(SeriesFixtures::SERIES_PREVIEW))
            ->setName('Saison 1')
            ->setRank(1)
            ->setDescription(
                'Arthur est un Youtubeur célèbre sous pression qui n\'arrive plus à sortir de vidéo. ' .
                'Preview, une étrange fonctionnalité de la plateforme de vidéo, se propose de le relancer.'
            );

        $manager->persist($preview);

        $manager->flush();

        $this->addReference(self::SEASON_PREVIEW_1, $preview);
    }

    public function getDependencies(): array
    {
        return array(
            SeriesFixtures::class,
        );
    }
}
