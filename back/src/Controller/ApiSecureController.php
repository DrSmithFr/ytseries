<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;

/**
 * @Route("/api")
 */
class ApiSecureController extends BaseAdminController
{
    /**
     * @Route("/user_info", name="api_user_info")
     * @return JsonResponse
     */
    public function userInformationAction()
    {
        /** @var User $user */
        $user = $this->getUser();

        return new JsonResponse(
            [
                'email'    => $user->getEmail(),
                'username' => $user->getUsername(),
                'roles'    => $user->getRoles(),
            ],
            JsonResponse::HTTP_OK
        );
    }
}
