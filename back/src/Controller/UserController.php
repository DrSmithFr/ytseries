<?php

declare(strict_types = 1);

namespace App\Controller;

use Exception;
use App\Entity\User;
use App\Form\RegisterType;
use App\Service\UserService;
use App\Model\RegisterModel;
use JMS\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Controller\Traits\SerializerAware;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route(path="/users")
 */
class UserController extends AbstractController
{
    use SerializerAware;

    /**
     * UserController constructor.
     *
     * @param SerializerInterface $serializer
     */
    public function __construct(SerializerInterface $serializer)
    {
        $this->setSerializer($serializer);
    }

    /**
     * @Route(path="/register", methods={"POST"}, name="public_users_register")
     * @throws Exception
     *
     * @param Request                $request
     * @param UserService            $userService
     * @param EntityManagerInterface $entityManager
     * @param KernelInterface        $kernel
     *
     * @return JsonResponse
     */
    public function register(
        Request $request,
        UserService $userService,
        EntityManagerInterface $entityManager,
        KernelInterface $kernel
    ): JsonResponse {
        $form = $this
            ->createForm(RegisterType::class, $reg = new RegisterModel())
            ->submit($request->request->all());

        if (!($form->isSubmitted() && $form->isValid())) {
            return $this->formErrorResponse($form, $kernel->isDebug());
        }

        $user = $entityManager
            ->getRepository(User::class)
            ->findOneBy(['username' => $reg->getUsername()]);

        if ($user !== null) {
            return $this->messageResponse(
                'username already in use',
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = $userService->createUser(
            $reg->getUsername(),
            $reg->getPassword()
        );

        if ($user->getPassword() === null) {
            // should never append
            return $this->messageResponse(
                'cannot perform encryption',
                Response::HTTP_I_AM_A_TEAPOT
            );
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->createResponse($user, 'user created');
    }

    /**
     * @Route(path="/available", methods={"POST"}, name="public_users_available")
     * @param Request                $request
     * @param EntityManagerInterface $entityManager
     *
     * @return JsonResponse
     */
    public function available(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $username = $request->get('username');

        if (!$username) {
            return $this->messageResponse(
                'not mail provided',
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = $entityManager
            ->getRepository(User::class)
            ->findOneBy(['username' => $username]);

        if ($user !== null) {
            return $this->messageResponse(
                'username already in use',
                Response::HTTP_FORBIDDEN
            );
        }

        return $this->messageResponse('username available');
    }

    /**
     * @Route(path="/current", methods={"GET"}, name="users_current")
     * @return JsonResponse
     */
    public function currentUser(): JsonResponse
    {
        return $this->serializeResponse($this->getUser());
    }
}
