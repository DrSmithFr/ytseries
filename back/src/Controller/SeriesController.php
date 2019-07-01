<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\SeriesRepository;
use Doctrine\ORM\NonUniqueResultException;
use JMS\Serializer\SerializerBuilder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SeriesController
{
    /**
     * @Route("/open/series/{id}", name="api_series_one")
     * @param Request          $request
     * @param SeriesRepository $repository
     * @return JsonResponse
     * @throws NonUniqueResultException
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

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($series, 'json');

        return (new JsonResponse())
            ->setContent($jsonContent);
    }
}
