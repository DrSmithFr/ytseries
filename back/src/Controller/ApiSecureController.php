<?php

namespace App\Controller;

use App\Entity\Historic;
use App\Entity\User;
use App\Repository\EpisodeRepository;
use App\Repository\HistoricRepository;
use App\Repository\SeriesRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use JMS\Serializer\SerializerBuilder;
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

    /**
     * @Route("/add_to_historic", name="api_historic_add", methods={"POST"})
     * @param Request                $request
     * @param HistoricRepository     $historicRepository
     * @param SeriesRepository       $seriesRepository
     * @param EpisodeRepository      $episodeRepository
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     */
    public function addToHistoricAction(
        Request $request,
        HistoricRepository $historicRepository,
        SeriesRepository $seriesRepository,
        EpisodeRepository $episodeRepository,
        EntityManagerInterface $entityManager
    )
    {
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
        $historic->setTimeCode((int) $request->get('time_code'));

        $entityManager->persist($historic);
        $entityManager->flush();

        return new JsonResponse([], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/get_historic/{series_id}", name="api_historic_get", methods={"GET"})
     * @param Request            $request
     * @param HistoricRepository $historicRepository
     * @param SeriesRepository   $seriesRepository
     * @return JsonResponse
     */
    public function getHistoricAction(
        Request $request,
        HistoricRepository $historicRepository,
        SeriesRepository $seriesRepository
    )
    {
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
                'episode_id' => $historic->getEpisode()->getId(),
                'time_code'  => $historic->getTimeCode(),
            ],
            JsonResponse::HTTP_OK
        );
    }

    /**
     * @Route("/historic", name="api_historic", methods={"GET"})
     * @param HistoricRepository $repository
     * @return JsonResponse
     */
    public function getHistoricListAction(
        HistoricRepository $repository
    )
    {
        $user = $this->getUser();
        $historicList = $repository->findAllByUser($user);

        $result = [];

        /** @var Historic $historic */
        foreach ($historicList as $historic) {
            $series = $historic->getSeries();

            $result[] = [
                'id' => $series->getImportCode(),
                'name' => $series->getName(),
                'image' => $series->getImage(),
                'description' => $series->getDescription()
            ];
        }

        return new JsonResponse($result);
    }
}
