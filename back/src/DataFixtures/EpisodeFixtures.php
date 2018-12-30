<?php

namespace App\DataFixtures;

use App\Entity\Episode;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class EpisodeFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class EpisodeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $previewEp1 = (new Episode())
            ->setSeason($this->getReference(SeasonFixtures::SEASON_PREVIEW_1))
            ->setRank(1)
            ->setCode('5bMOgK4SXH4')
            ->setName('#React');

        $jdgEp1 = (new Episode())
            ->setSeason($this->getReference(SeasonFixtures::SEASON_JDG_1))
            ->setRank(1)
            ->setCode('00vLSHLXr1U')
            ->setName('Belle île en mer');

        $jdgEp2 = (new Episode())
            ->setSeason($this->getReference(SeasonFixtures::SEASON_JDG_1))
            ->setRank(2)
            ->setCode('lsXqsYOJmDo')
            ->setName('Le mystère des caisses en bois');

        $jdgEp3 = (new Episode())
            ->setSeason($this->getReference(SeasonFixtures::SEASON_JDG_1))
            ->setRank(3)
            ->setCode('3njPN68JP1E')
            ->setName('Cargo de nuit');

        $manager->persist($previewEp1);
        $manager->persist($jdgEp1);
        $manager->persist($jdgEp2);
        $manager->persist($jdgEp3);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return array(
            SeasonFixtures::class,
        );
    }
}
