<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Exception;
use Swift_Mailer;
use Swift_Message;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class WelcomeMailCommand extends Command
{
    /**
     * @var UserRepository|null
     */
    private $userRepository;
    /**
     * @var Swift_Mailer|null
     */
    private $mailer;

    public function __construct(
        UserRepository $userRepository,
        Swift_Mailer $mailer
    ) {
        $this->userRepository = $userRepository;
        $this->mailer         = $mailer;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setName('app:mail:welcome')
            ->setDescription('sends THE mail.');
    }

    /**
     * @throws Exception
     * @param OutputInterface $output
     * @param InputInterface  $input
     * @return int|void|null
     */
    protected function execute(InputInterface $input, OutputInterface $output): void
    {
        $users = $this->userRepository->findAll();

        /** @var User $user */
        foreach ($users as $user) {
            $message = (new Swift_Message())
                ->setSubject('Password reset')
                ->setFrom('noreplay@egis-eams.com')
                ->setTo($user->getEmail())
                ->setBody(
                    $this->renderView(
                        'emails/password_reset.html.twig',
                        [
                            'user' => $user,
                        ]
                    ),
                    'text/html'
                );

            $this->mailer->send($message);
        }
    }
}
