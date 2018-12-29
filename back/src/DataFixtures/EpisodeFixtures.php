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
        $ep1 = new Episode();

        $ep1
            ->setSeason($this->getReference(SeasonFixtures::SEASON_PREVIEW_1))
            ->setRank(1)
            ->setCode('5bMOgK4SXH4')
            ->setName('#React')
            ->setDescription("L'episode 1!");

        $manager->persist($ep1);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return array(
            SeasonFixtures::class,
        );
    }
}
