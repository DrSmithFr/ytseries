<?php

namespace App\Command;

use App\Entity\Episode;
use App\Entity\Season;
use App\Entity\Series;
use App\Entity\SeriesType;
use App\Repository\EpisodeRepository;
use App\Repository\SeasonRepository;
use App\Repository\SeriesRepository;
use App\Repository\SeriesTypeRepository;
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
    /**
     * @var SeriesTypeRepository
     */
    private $seriesTypeRepository;
    /**
     * @var SeriesRepository
     */
    private $seriesRepository;
    /**
     * @var SeasonRepository
     */
    private $seasonRepository;
    /**
     * @var EpisodeRepository
     */
    private $episodeRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        SeriesTypeRepository $seriesTypeRepository,
        SeriesRepository $seriesRepository,
        SeasonRepository $seasonRepository,
        EpisodeRepository $episodeRepository
    )
    {
        $this->entityManager = $entityManager;
        parent::__construct();
        $this->seriesTypeRepository = $seriesTypeRepository;
        $this->seriesRepository     = $seriesRepository;
        $this->seasonRepository     = $seasonRepository;
        $this->episodeRepository    = $episodeRepository;
    }

    protected function configure()
    {
        $this
            ->setName('app:series:import')
            ->setDescription('Rebuild the Index and populate it.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $series        = $this->getYamlSeriesData();
        $seriesTypeMap = $this->getSeriesTypes($series['types']);

        $io->section('Importing series');
        $io->progressStart(count($series['series']));

        foreach ($series['series'] as $key => $data) {
            $s = $this->getSeries($key, $data, $seriesTypeMap);

            $this->entityManager->persist($s);
            $this->entityManager->flush();

            $io->progressAdvance();
        }

        $io->progressFinish();
        $io->success('Done');
    }

    private function getYamlSeriesData()
    {
        $fileString = file_get_contents(__DIR__ . '/../Resources/series.yaml');

        return Yaml::parse($fileString);
    }

    private function getSeriesTypes(array $types) : array
    {
        $seriesTypesMap = [];

        foreach ($types as $key => $name) {
            $type = $this->seriesTypeRepository->findOneBy(['importCode' => $key]);

            if (null === $type) {
                $type = (new SeriesType())->setImportCode($key);
            }

            $type->setName($name);
            $this->entityManager->persist($type);

            $seriesTypesMap[ $key ] = $type;
        }

        $this->entityManager->flush();

        return $seriesTypesMap;
    }

    private function getSeries(string $importCode, array $data, array $seriesTypesMap) : Series
    {
        $series = $this->seriesRepository->findOneBy(['importCode' => $importCode]);

        if (null === $series) {
            $series = (new Series())->setImportCode($importCode);
        }

        $typeId = $data['type'];

        $series
            ->setName($data['name'])
            ->setLocale($data['locale'])
            ->setImage($data['image'])
            ->setDescription($data['description'])
            ->setType($seriesTypesMap[ $typeId ]);

        foreach ($data['seasons'] as $index => $seasonData) {
            $season = $this->getSeason($importCode, $index, $seasonData);
            $series->addSeason($season);
        }

        $this->entityManager->persist($series);

        return $series;
    }

    private function getSeason(string $importCode, int $index, array $data) : Season
    {
        $importCode = sprintf('%s_%s', $importCode, $index);
        $season     = $this->seasonRepository->findOneBy(['importCode' => $importCode]);

        if (null === $season) {
            $season = (new Season())->setImportCode($importCode);
        }

        $season
            ->setRank($index)
            ->setName($data['name']);

        foreach ($data['episodes'] as $epIndex => $episodeData) {
            $episode = $this->getEpisode($importCode, $epIndex, $episodeData);
            $season->addEpisode($episode);
        }

        $this->entityManager->persist($season);

        return $season;
    }

    private function getEpisode(string $importCode, int $index, array $data) : Episode
    {
        $importCode = sprintf('%s_%s', $importCode, $index);
        $episode    = $this->episodeRepository->findOneBy(['importCode' => $importCode]);

        if (null === $episode) {
            $episode = (new Episode())->setImportCode($importCode);
        }

        $episode
            ->setRank($index)
            ->setName($data['name'])
            ->setCode($data['code']);

        $this->entityManager->persist($episode);

        return $episode;
    }
}