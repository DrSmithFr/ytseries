<?php

declare(strict_types=1);

namespace App\Command;

use App\Service\YoutubeService;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Yaml\Yaml;

class PlaylistReaderCommand extends Command
{
    /**
     * @var YoutubeService
     */
    private $youtubeService;

    public function __construct(
        YoutubeService $youtubeService
    ) {
        parent::__construct();
        $this->youtubeService = $youtubeService;
    }

    protected function configure(): void
    {
        $this
            ->setName('app:playlist:read')
            ->setDescription('Rebuild the Index and populate it.')
            ->addOption('reverse', 'r', InputOption::VALUE_OPTIONAL)
            ->addArgument('playlistId', InputArgument::OPTIONAL);
    }

    /**
     * @param InputInterface  $input
     * @param OutputInterface $output
     * @return int|void|null
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): void
    {
        $playlistCode = $input->getArgument('playlistId');
        $io = new SymfonyStyle($input, $output);

        $io->section('Reading playlist information');
        $data = $this->youtubeService->getPlaylistInfo($playlistCode);

        $reverse = $input->getOption('reverse');

        if ($reverse) {
            $data = array_reverse($data);
        }

        $yaml = Yaml::dump($data);
        $io->writeln($yaml);
    }
}
