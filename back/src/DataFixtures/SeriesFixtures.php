<?php

namespace App\DataFixtures;

use App\Entity\Series;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class SeriesFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class SeriesFixtures extends Fixture implements DependentFixtureInterface
{
    const SERIES_PREVIEW = 'series-preview';
    const SERIES_JDG = 'series-jdg';

    public function load(ObjectManager $manager) : void
    {
        $preview = (new Series())
            ->setName('Preview')
            ->setLocale('fr')
            ->setType($this->getReference(SeriesTypeFixtures::TYPE_SERIES))
            ->setImage('https://img.youtube.com/vi/5bMOgK4SXH4/maxresdefault.jpg')
            ->setDescription(
                'Arthur est un Youtubeur célèbre sous pression qui n\'arrive plus à sortir de vidéo. ' .
                'Preview, une étrange fonctionnalité de la plateforme de vidéo, se propose de le relancer.'
            );

        $jdg = (new Series())
            ->setName("Let's play Narratif de Stranded Deep par Joueur Du Genier")
            ->setLocale('fr')
            ->setType($this->getReference(SeriesTypeFixtures::TYPE_SERIES))
            ->setImage('https://img.youtube.com/vi/00vLSHLXr1U/maxresdefault.jpg')
            ->setDescription('La plage le soleil et les crustacés ! ');

        $manager->persist($preview);
        $manager->persist($jdg);

        $manager->flush();

        $this->addReference(self::SERIES_PREVIEW, $preview);
        $this->addReference(self::SERIES_JDG, $jdg);
    }

    /**
     * This method must return an array of fixtures classes
     * on which the implementing class depends on
     *
     * @return array
     */
    public function getDependencies()
    {
        return [
            SeriesTypeFixtures::class
        ];
    }
}
