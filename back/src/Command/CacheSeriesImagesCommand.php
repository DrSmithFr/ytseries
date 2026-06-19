<?php

namespace App\Command;

use App\Entity\Series;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:series:cache-images',
    description: 'Télécharge et met en cache local les images des séries.'
)]
class CacheSeriesImagesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private ParameterBagInterface $parameterBag,
        private HttpClientInterface $http
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $repo = $this->em->getRepository(Series::class);
        $seriesList = $repo->findAll();

        $downloadDir = $this
            ->parameterBag
            ->get('download_dir');

        if (!is_dir($downloadDir)) {
            mkdir($downloadDir, 0777, true);
        }

        /** @var Series $series */
        foreach ($seriesList as $series) {
            $url = $series->getImage();

            if (!$url || !str_starts_with($url, 'https')) {
                continue;
            }

            $output->writeln("Téléchargement : $url");

            try {
                $response = $this->http->request('GET', $url);
                if ($response->getStatusCode() !== 200) {
                    $output->writeln("<error>Échec pour {$series->getName()}</error>");
                    continue;
                }

                // nom de fichier basé sur hash pour éviter doublons
                $filename = md5($url) . '.' . pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
                $path = $downloadDir . DIRECTORY_SEPARATOR. $filename;

                file_put_contents($path, $response->getContent());

                // update entité
                $series->setImage('/assets/download/' . $filename);

                $this->em->persist($series);
            } catch (\Throwable $e) {
                $output->writeln("<error>Erreur sur {$series->getName()} : {$e->getMessage()}</error>");
            }
        }

        $this->em->flush();

        $output->writeln('<info>Images téléchargées et séries mises à jour.</info>');

        return Command::SUCCESS;
    }
}
