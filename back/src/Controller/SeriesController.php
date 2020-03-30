<?php

declare(strict_types = 1);

namespace App\Controller;

use RuntimeException;
use App\Entity\Series;
use App\Form\SeriesType;
use App\Repository\SeriesRepository;
use JMS\Serializer\SerializerBuilder;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/series", name="series_")
 */
class SeriesController extends AbstractController
{
    /**
     * @Route("/{id}", name="get")
     * @throws NonUniqueResultException
     *
     * @param SeriesRepository $repository
     * @param Request          $request
     *
     * @return JsonResponse
     */
    public function seriesInformationAction(
        Request $request,
        SeriesRepository $repository
    ): JsonResponse {
        $series = $repository->getFullyLoadedSeriesByImportCode($request->get('id'));

        if (null === $series) {
            return new JsonResponse(
                ['error' => 'Series not found'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $serializer  = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($series, 'json');

        return (new JsonResponse())
            ->setContent($jsonContent);
    }

    /**
     * @Route("/managed", name="managed")
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
     * @Route("", name="api_series_update", methods={"PATCH", "PUT"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function seriesUpdateAction(
        Request $request
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $series = new Series();

        $form = $this
            ->createForm(SeriesType::class, $series)
            ->submit($request->request->all());

        if (!$form->isSubmitted()) {
            return new JsonResponse(['message' => 'No form submitted'], JsonResponse::HTTP_NOT_ACCEPTABLE);
        }

        if (!$form->isValid()) {
            throw new RuntimeException('something append');
        }

        // TODO save

        $serializer  = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($series, 'json');

        return (new JsonResponse())
            ->setContent($jsonContent);
    }
}
