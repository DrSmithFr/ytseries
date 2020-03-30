<?php


namespace App\DataFixtures;

use Exception;
use App\Entity\Role;
use App\Service\UserService;
use App\Enum\SecurityRoleEnum;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class UserFixtures extends Fixture
{
    public const REFERENCE_ADMIN       = 'user-admin';
    public const REFERENCE_USER        = 'user-user';

    /**
     * @var UserService
     */
    private $userService;

    /**
     * UserFixtures constructor.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @throws Exception
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $admin      = $this->userService->createUser('admin', 'admin');
        $user       = $this->userService->createUser('user', 'user');

        $this->setReference(self::REFERENCE_ADMIN, $admin);
        $this->setReference(self::REFERENCE_USER, $user);

        $admin->addRole(SecurityRoleEnum::ADMIN);

        $manager->persist($admin);
        $manager->persist($user);

        $manager->flush();
    }
}
