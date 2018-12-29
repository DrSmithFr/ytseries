<?php

namespace App\Command;

use App\Repository\AssetRepository;
use App\Service\AssetIndexerService;
use App\Service\AssetSearchService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AssetsIndexationCommand extends Command
{
    private $elasticSearchService;
    private $indexer;
    private $repository;

    public function __construct(
        AssetSearchService $elasticSearchService,
        AssetIndexerService $indexer
//        AssetRepository $repository
    ) {
        $this->elasticSearchService = $elasticSearchService;
        $this->indexer = $indexer;
//        $this->repository = $repository;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setName('app:assets:indexation')
            ->setDescription('Rebuild the Index and populate it.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->section('Index creation');

        $index = $this->elasticSearchService->createTempIndex();

        $io->success('Index created!');

        $io->section('Assets indexation');

        $assets = $this->repository->findAll();

        $io->progressStart(count($assets));

        $documents = [];
        foreach ($assets as $asset) {
            $documents[] = $this->indexer->buildDocument($asset);
            $io->progressAdvance();
        }
        $io->progressFinish();

        $index->addDocuments($documents);
        $index->refresh();

        $io->success('Index populated and ready!');
        $io->section('Switching temporary index to production');

        $this->elasticSearchService->createIndex();
        $response = $this->elasticSearchService->switchTempIndexWithProduction();

        if ($response->getStatus() === 200) {
            $io->success('Index switched!');
        } else {
            $io->error('Index cannot switch');
        }
    }
}