<?php

declare(strict_types = 1);

namespace App\Controller;

use RuntimeException;
use App\Form\SeriesType;
use App\Repository\SeriesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/management", name="management_")
 */
class ManagementController extends AbstractController
{
    /**
     * @Route("/series", name="series_managed", methods={"GET"})
     * @param SeriesRepository $repository
     *
     * @return JsonResponse
     */
    public function managedSeriesAction(
        SeriesRepository $repository
    ): JsonResponse {
        $managed = [];

        if ($this->isGranted('ROLE_ADMIN')) {
            $managed = $repository->getManaged();
        }

        return new JsonResponse($managed);
    }

    /**
     * @Route("/series", name="series_update", methods={"PATCH", "PUT"})
     * @param Request                $request
     * @param SeriesRepository       $repository
     * @param EntityManagerInterface $entityManager
     *
     * @return JsonResponse
     */
    public function seriesUpdateAction(
        Request $request,
        SeriesRepository $repository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $series = $repository->find($request->get('id'));

        if (!$series) {
            throw new RuntimeException('series not found');
        }

        $form = $this
            ->createForm(SeriesType::class, $series)
            ->submit($request->request->all());

        if (!$form->isSubmitted()) {
            return new JsonResponse(['message' => 'No form submitted'], JsonResponse::HTTP_NOT_ACCEPTABLE);
        }

        if (!$form->isValid()) {
            throw new RuntimeException('something append');
        }

        $entityManager->flush();

        return $this->json(['message' => 'series updated']);
    }
}
