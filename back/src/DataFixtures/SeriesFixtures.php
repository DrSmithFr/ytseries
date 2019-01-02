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
    const SERIES_JDG = 'series-jdg';

    public function load(ObjectManager $manager) : void
    {
        $preview = (new Series())
            ->setName('Preview')
            ->setLocale('fr')
            ->setImage('https://img.youtube.com/vi/5bMOgK4SXH4/maxresdefault.jpg')
            ->setDescription(
                'Arthur est un Youtubeur célèbre sous pression qui n\'arrive plus à sortir de vidéo. ' .
                'Preview, une étrange fonctionnalité de la plateforme de vidéo, se propose de le relancer.'
            );

        $jdg = (new Series())
            ->setLocale('fr')
            ->setImage('https://img.youtube.com/vi/00vLSHLXr1U/maxresdefault.jpg')
            ->setName("Let's play Narratif de Stranded Deep par Joueur Du Genier")
            ->setDescription('La plage le soleil et les crustacés ! ');

        $manager->persist($preview);
        $manager->persist($jdg);

        $manager->flush();

        $this->addReference(self::SERIES_PREVIEW, $preview);
        $this->addReference(self::SERIES_JDG, $jdg);
    }
}
