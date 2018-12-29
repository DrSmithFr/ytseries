<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class UserFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class UserFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager): void
    {
        $devUser    = $this->makeUser('dev', 'dev', ['group-dev']);
        $commonUser = $this->makeUser('user', 'user', ['group-user']);

        $devUser->setSuperAdmin(true);

        $manager->persist($devUser);
        $manager->persist($commonUser);

        $manager->flush();

        $this->addReference('user-dev', $devUser);
        $this->addReference('user-user', $commonUser);
    }

    private function makeUser(string $name, string $pass, array $groups = []): User
    {
        $user = new User();
        $user
            ->setUsername($name)
            ->setEmail(sprintf('%s@local.com', $name))
            ->setEnabled(true);

        $password = $this->encoder->encodePassword($user, $pass);
        $user->setPassword($password);

        foreach ($groups as $group) {
            $user->addGroup($this->getReference($group));
        }

        return $user;
    }

    public function getDependencies(): array
    {
        return array(
            GroupFixtures::class,
        );
    }
}
