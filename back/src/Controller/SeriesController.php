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
}
