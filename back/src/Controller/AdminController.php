<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\SecurityRoleEnum;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;

class AdminController extends BaseAdminController
{
    /**
     * @Route("dashboard", name="admin_dashboard")
     * @param EntityManagerInterface $entityManager
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function dashboardAction(EntityManagerInterface $entityManager)
    {
        $userArray = $entityManager->getRepository(User::class)->findAll();

        /** @var ArrayCollection|User[] $users */
        $users = new ArrayCollection($userArray);

        /** @var ArrayCollection|User[] $admin */
        $admin = $users->filter(function (User $user) {
            return in_array(SecurityRoleEnum::ADMIN, $user->getRoles());
        });

        $loads = array_map(
            function (float $f) {
                return floor($f * 100) / 100;
            },
            sys_getloadavg()
        );

        return $this->render('admin/dashboard.html.twig', [
            'load'         => $loads,
            'user_count'   => $users->count(),
            'admin_count'  => $admin->count(),
            'memory_usage' => $this->getServerMemoryUsage()
        ]);
    }

    private function getServerMemoryUsage(): float
    {
        $free        = shell_exec('free');
        $free        = (string)trim($free);
        $freeArr     = explode("\n", $free);
        $mem         = explode(" ", $freeArr[1]);
        $mem         = array_filter($mem);
        $mem         = array_merge($mem);
        $memoryUsage = $mem[2] / $mem[1] * 100;

        return floor($memoryUsage * 100) / 100;
    }

    public function createNewUserEntity(): User
    {
        return $this->get('fos_user.user_manager')->createUser();
    }

    public function prePersistUserEntity(User $user): void
    {
        $this->get('fos_user.user_manager')->updateUser($user, false);
    }

    public function preUpdateUserEntity(User $user): void
    {
        $this->get('fos_user.user_manager')->updateUser($user, false);
    }
}
