<?php

namespace App\DataFixtures;

use App\Entity\Group;
use App\Enum\SecurityRoleEnum;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * Class GroupFixtures
 * @package App\DataFixtures
 * @codeCoverageIgnore
 */
class GroupFixtures extends Fixture
{
    const GROUP_DEV = 'group-dev';
    const GROUP_USER = 'group-user';

    public function load(ObjectManager $manager): void
    {
        $devGroup    = new Group('dev', [SecurityRoleEnum::SUPER_ADMIN]);
        $commonGroup = new Group('user', [SecurityRoleEnum::USER]);

        $manager->persist($devGroup);
        $manager->persist($commonGroup);

        $manager->flush();

        $this->addReference(self::GROUP_DEV, $devGroup);
        $this->addReference(self::GROUP_USER, $commonGroup);
    }
}
