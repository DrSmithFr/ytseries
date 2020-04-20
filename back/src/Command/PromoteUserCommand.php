<?php

declare(strict_types = 1);

namespace App\Command;

use App\Entity\User;
use RuntimeException;
use App\Enum\SecurityRoleEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PromoteUserCommand extends Command
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
            ->setName('security:user:promote')
            ->setDescription('Update episode durations')
            ->addArgument('username', InputArgument::REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $io->section('Loading User to update');

        /** @var User|null $user */
        $user = $this
            ->entityManager
            ->getRepository(User::class)
            ->findOneBy(['username' => strtolower($input->getArgument('username'))]);

        if (!$user) {
            throw new RuntimeException('cannot find user');
        }

        $user->addRole(SecurityRoleEnum::ADMIN);

        $this->entityManager->flush();

        $io->success('DONE');
    }
}
