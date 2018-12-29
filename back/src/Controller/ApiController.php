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
class ApiController extends BaseAdminController
{
    /**
     * @Route("/password_reset_request", name="api_password_reset_request")
     * @param Request                 $request
     * @param \Swift_Mailer           $mailer
     * @param UserManagerInterface    $userManager
     * @param TokenGeneratorInterface $tokenGenerator
     * @return Response | JsonResponse
     */
    public function passwordResetRequestAction(
        Request $request,
        \Swift_Mailer $mailer,
        UserManagerInterface $userManager,
        TokenGeneratorInterface $tokenGenerator
    ) {
        $username = $request->get('username');

        /** @var $user UserInterface */
        $user = $userManager->findUserByUsername($username);

        if (null === $user) {
            return new JsonResponse(
                [
                    'error' => 'User not recognised'
                ],
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        if ($user->isPasswordRequestNonExpired($this->container->getParameter('fos_user.resetting.token_ttl'))) {
            return new JsonResponse(
                [
                    'error' => 'Reset password already requested',
                ],
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        $user->setConfirmationToken($tokenGenerator->generateToken());
        $user->setPasswordRequestedAt(new \DateTime());

        $userManager->updateUser($user);

        $message = (new \Swift_Message())
            ->setSubject('Password reset')
            ->setFrom('noreplay@egis-eams.com')
            ->setTo($user->getEmail())
            ->setBody(
                $this->renderView(
                    'emails/password_reset.html.twig',
                    [
                        'user' => $user
                    ]
                ),
                'text/html'
            );

        $mailer->send($message);

        return new JsonResponse(
            [
                'info' => 'mail send'
            ],
            JsonResponse::HTTP_ACCEPTED
        );
    }

    /**
     * @Route("/password_reset", name="api_password_reset")
     * @param Request              $request
     * @param UserRepository       $userRepository
     * @param UserManagerInterface $userManager
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function passwordResetAction(
        Request $request,
        UserRepository $userRepository,
        UserManagerInterface $userManager
    ) {
        $token    = $request->get('token');
        $password = $request->get('new_password');

        $user = $userRepository->getUserByPasswordResetToken($token);

        if (null === $user) {
            return new JsonResponse(
                [
                    'error' => 'token not valid.'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user->setPasswordRequestedAt(null);
        $user->setConfirmationToken(null);
        $user->setPlainPassword($password);

        $userManager->updatePassword($user);
        $userManager->updateUser($user);

        return new JsonResponse(
            [
                'info' => 'Password changed.',
            ],
            JsonResponse::HTTP_ACCEPTED
        );
    }

    /**
     * @Route("/password_reset_token_validity", name="api_password_reset_token_validity")
     * @param Request        $request
     * @param UserRepository $userRepository
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function isPasswordResetTokenValidAction(
        Request $request,
        UserRepository $userRepository
    ) {
        $token = $request->get('token');
        $user  = $userRepository->getUserByPasswordResetToken($token);

        if (null === $user) {
            return new JsonResponse(
                [
                    'error' => 'token not valid.'
                ],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        return new JsonResponse(
            [
                'info' => 'token valid.',
            ],
            JsonResponse::HTTP_OK
        );
    }

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
