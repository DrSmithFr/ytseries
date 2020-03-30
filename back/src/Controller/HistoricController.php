<?php

declare(strict_types = 1);

namespace App\Controller;

use App\Entity\Historic;
use App\Repository\SeriesRepository;
use App\Repository\EpisodeRepository;
use App\Repository\HistoricRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/historic", name="historic_")
 */
class HistoricController extends AbstractController
{
    /**
     * @Route("/{series_id}", name="update_by_series", methods={"PATCH"})
     * @throws NonUniqueResultException
     *
     * @param HistoricRepository     $historicRepository
     * @param SeriesRepository       $seriesRepository
     * @param EpisodeRepository      $episodeRepository
     * @param EntityManagerInterface $entityManager
     * @param Request                $request
     *
     * @return JsonResponse
     */
    public function addToHistoricAction(
        Request $request,
        HistoricRepository $historicRepository,
        SeriesRepository $seriesRepository,
        EpisodeRepository $episodeRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $series = $seriesRepository->findOneByImportCode($request->get('series_id'));

        if (null === $series) {
            return new JsonResponse(
                ['error' => 'Series not found'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $episode = $episodeRepository->findOneBySeriesAndId($series, $request->get('episode_id'));

        if (null === $episode) {
            return new JsonResponse(
                ['error' => 'Episode not found in this series'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user     = $this->getUser();
        $historic = $historicRepository->getHistoricByUserAndSeries($user, $series);

        if (null === $historic) {
            $historic = new Historic();
            $historic
                ->setUser($user)
                ->setSeries($series);
        }

        $historic->setEpisode($episode);
        $historic->setTimeCode((int)$request->get('time_code'));

        $entityManager->persist($historic);
        $entityManager->flush();

        return new JsonResponse([], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/{series_id}", name="get_by_series", methods={"GET"})
     * @throws NonUniqueResultException
     *
     * @param HistoricRepository $historicRepository
     * @param SeriesRepository   $seriesRepository
     * @param Request            $request
     *
     * @return JsonResponse
     */
    public function getHistoricAction(
        Request $request,
        HistoricRepository $historicRepository,
        SeriesRepository $seriesRepository
    ): JsonResponse {
        $series = $seriesRepository->findOneByImportCode($request->get('series_id'));

        if (null === $series) {
            return new JsonResponse(
                ['error' => 'Series not found'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user     = $this->getUser();
        $historic = $historicRepository->getHistoricByUserAndSeries($user, $series);

        if (null === $historic) {
            return new JsonResponse(
                ['error' => 'No historic found for this series'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        return new JsonResponse(
            [
                'episode_id' => $historic->getEpisode() ? $historic->getEpisode()->getId() : null,
                'time_code'  => $historic->getTimeCode(),
            ],
            JsonResponse::HTTP_OK
        );
    }

    /**
     * @Route("", name="get_all", methods={"GET"})
     * @param HistoricRepository $repository
     *
     * @return JsonResponse
     */
    public function getCompletHistoric(
        HistoricRepository $repository
    ): JsonResponse {
        $user         = $this->getUser();
        $historicList = $repository->findAllByUser($user);

        $result = [];

        /** @var Historic $historic */
        foreach ($historicList as $historic) {
            $series = $historic->getSeries();

            if ($series === null) {
                continue;
            }

            $result[] = [
                'id'          => $series->getImportCode(),
                'name'        => $series->getName(),
                'image'       => $series->getImage(),
                'description' => $series->getDescription(),
            ];
        }

        return new JsonResponse($result);
    }
}
