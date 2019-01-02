<?php

namespace App\DataFixtures;

use App\Entity\Series;
use App\Entity\SeriesType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class SeriesTypeFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class SeriesTypeFixtures extends Fixture
{
    const TYPE_MOVIE = 'type-movie';
    const TYPE_SERIES = 'type-series';
    const TYPE_DOCUMENTARY = 'type-documentary';

    public function load(ObjectManager $manager) : void
    {
        $movie = (new SeriesType())->setName('Movie');
        $series = (new SeriesType())->setName('Series');
        $documentary = (new SeriesType())->setName('Documentary');

        $manager->persist($movie);
        $manager->persist($series);
        $manager->persist($documentary);

        $manager->flush();

        $this->addReference(self::TYPE_MOVIE, $movie);
        $this->addReference(self::TYPE_SERIES, $series);
        $this->addReference(self::TYPE_DOCUMENTARY, $documentary);
    }
}
