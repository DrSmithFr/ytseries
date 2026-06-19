<?php

declare(strict_types = 1);

namespace App\Controller\Api;

use App\Repository\SeriesRepository;
use Doctrine\ORM\NonUniqueResultException;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
    #[Route("/public/series/{id}", name: "api_series_get", methods: ["GET"])]
    public function seriesInformationAction(
        Request $request,
        SeriesRepository $repository
    ): JsonResponse {
        $series = $repository->getFullyLoadedSeriesByImportCode($request->get('id'));

        if (null === $series) {
            return new JsonResponse(
                ['error' => 'Series not found'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $serializer  = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($series, 'json');

        return (new JsonResponse())
            ->setContent($jsonContent);
    }
}
