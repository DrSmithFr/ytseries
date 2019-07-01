<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\EpisodeRepository;
use App\Service\YoutubeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class VideoDurationUpdateCommand extends Command
{
    /**
     * @var YoutubeService
     */
    private $youtubeService;
    /**
     * @var EpisodeRepository
     */
    private $episodeRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(
        YoutubeService $youtubeService,
        EpisodeRepository $episodeRepository,
        EntityManagerInterface $entityManager
    ) {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->youtubeService = $youtubeService;
        $this->episodeRepository = $episodeRepository;
    }

    protected function configure()
    {
        $this
            ->setName('app:video:duration')
            ->setDescription('Update episode durations');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->section('Loading Episode to update');
        $episodes = $this->episodeRepository->findAllWithoutDuration();

        $io->progressStart(count($episodes));

        foreach ($episodes as $episode) {
            $duration = $this->youtubeService->getVideoDuration($episode);

            if (null === $duration) {
                $io->error(sprintf('Cannot load %s infos', $episode->getName()));
            }

            $episode->setDuration($duration);

            $this->entityManager->flush();
            $this->entityManager->detach($episode);

            $io->progressAdvance();
        }
        $io->progressFinish();

        $io->success(sprintf('%d entities updated.', count($episodes)));
    }
}
