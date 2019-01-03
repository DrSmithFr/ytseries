<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\SecurityRoleEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/open")
 */
class RegisterController extends BaseAdminController
{
    /**
     * @Route("/register", name="api_register")
     * @param Request                      $request
     * @param EntityManagerInterface       $entityManager
     * @param UserRepository               $userRepository
     * @param UserPasswordEncoderInterface $encoder
     * @return JsonResponse
     * @internal param SearchService $searchService
     */
    public function registerAction(
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $encoder
    )
    {
        $email = $request->get('email');
        $pass  = $request->get('password');

        if (! $email || ! $pass) {
            return new JsonResponse(
                ['error' => 'email or password empty'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $userRepository->findOneBy(['email' => strtolower($email)]);

        if ($user) {
            return new JsonResponse(
                ['error' => 'Email already used'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = new User();

        $user
            ->setUsername(strtolower($email))
            ->setEmail(strtolower($email))
            ->setEnabled(true)
            ->addRole(SecurityRoleEnum::USER);

        $password = $encoder->encodePassword($user, $pass);
        $user->setPassword($password);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['info' => 'User created.']);
    }
}
