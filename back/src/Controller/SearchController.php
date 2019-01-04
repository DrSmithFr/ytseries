<?php

namespace App\Controller;

use App\Repository\MapBackgroundRepository;
use App\Repository\SeriesRepository;
use App\Service\SearchService;
use Elastica\Aggregation\AbstractAggregation;
use Elastica\Aggregation\Terms;
use Elastica\Query\Match;
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
        $filters = json_decode($request->get('filters'), true);

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

            $textQuery = new BoolQuery();

            $textQuery->addShould($match);
            $textQuery->addShould($fuzzy);

            $filterQuery = new BoolQuery();

            foreach ($filters as $field => $value) {
                if (null !== $value) {
                    $filterMatch = new Match();
                    $filterMatch->setFieldQuery($field, $value);
                    $filterQuery->addShould($filterMatch);
                }
            }

            $bool = new BoolQuery();

            $bool->addMust($textQuery);
            $bool->addMust($filterQuery);

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
            $bool = new BoolQuery();

            $bool->addShould(new Query\MatchAll());

            foreach ($filters as $field => $value) {
                if (null !== $value) {
                    $filterMatch = new Match();
                    $filterMatch->setFieldQuery($field, $value);
                    $bool->addFilter($filterMatch);
                }
            }

            $query->setQuery($bool);
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
