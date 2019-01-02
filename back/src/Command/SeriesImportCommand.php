<?php

namespace App\Command;

use App\Repository\SeriesRepository;
use App\Service\IndexerService;
use App\Service\SearchService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Yaml\Yaml;

class SeriesImportCommand extends Command
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(
        EntityManagerInterface $entityManager
    ) {
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setName('app:series:import')
            ->setDescription('Rebuild the Index and populate it.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $series = $this->getYamlSeriesData();
        dump($series);
    }

    private function getYamlSeriesData()
    {
        $fileString = file_get_contents(__DIR__.'/../Resources/series.yaml');
        return Yaml::parse($fileString);
    }
}