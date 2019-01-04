<?php

namespace App\Controller;

use App\Repository\MapBackgroundRepository;
use App\Repository\SeriesRepository;
use App\Service\SearchService;
use Elastica\Aggregation\AbstractAggregation;
use Elastica\Aggregation\Terms;
use Elastica\ResultSet;
use JMS\Serializer\SerializerBuilder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;

use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MultiMatch;

/**
 * @Route("/open")
 */
class SearchController extends BaseAdminController
{
    /**
     * @Route("/search", name="api_asset_search")
     * @param Request       $request
     * @param SearchService $searchService
     * @return JsonResponse
     */
    public function getBackgroundLayersAction(
        Request $request,
        SearchService $searchService
    ) {
        $query = new Query();

        if ($q = $request->get('query')) {
            // add exact match query
            $match = new MultiMatch();
            $match->setQuery($q);
            $match->setFields(["name"]);
            $match->setAnalyzer('standard');

            // add miss spell query
            $fuzzy = new Query\Fuzzy();
            $fuzzy->setField('name', $q);

            $bool = new BoolQuery();

            $bool->addShould($match);
            $bool->addShould($fuzzy);

            $query->setQuery($bool);

            $query->setHighlight(
                [
                    'number_of_fragments' => 3,
                    'fragment_size' => 255,
                    'fields' => [
                        'name' => new \stdClass()
                    ]
                ]
            );
        } else {
            $query->setQuery(new Query\MatchAll());
        }

        $query->setSize(96);
        $query->setSort(
            [
                'id' => [
                    'order' => 'desc'
                ]
            ]
        );

        $query->addAggregation(
            (new Terms('locales'))->setField('locale')
        );

        $query->addAggregation(
            (new Terms('types'))->setField('type')
        );

        $result = $searchService->getIndex()->search($query);

//        dump($result); die;

        $assets = [];
        foreach ($result as $asset) {
            $assetData = $asset->getSource();

            $highlights = $asset->getHighlights();

            if (isset($highlights['name'])) {
                $assetData['name'] = $highlights['name'][0];
            }

            $assets[] = $assetData;
        }

        $filters = [
            'locales' => $result->getAggregation('locales')['buckets'],
            'types'   => $result->getAggregation('types')['buckets'],
        ];

        return new JsonResponse(
            [
                'assets' => $assets,
                'filters' => $filters
            ]
        );
    }

    /**
     * @Route("/series/{id}", name="api_series_info")
     * @param Request          $request
     * @param SeriesRepository $repository
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function seriesInformationAction(
        Request $request,
        SeriesRepository $repository
    )
    {
        $series = $repository->getFullyLoadedSeriesById($request->get('id', null));

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
