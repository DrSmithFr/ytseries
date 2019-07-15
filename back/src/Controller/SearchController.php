<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\SearchService;
use Elastica\Aggregation\Terms;
use Elastica\Query\Match;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MultiMatch;

/**
 * @Route("/open")
 */
class SearchController extends Controller
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
    ): JsonResponse {
        $filters = json_decode($request->get('filters'), true);

        $query = new Query();

        if ($q = $request->get('query')) {
            // add exact match query
            $match = new MultiMatch();
            $match->setQuery($q);
            $match->setFields(['name']);
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
                    'fragment_size'       => 255,
                    'fields'              => [
                        'name' => (object)[],
                    ],
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
                'import_date' => [
                    'order' => 'desc',
                ],
            ]
        );

        $query->addAggregation(
            (new Terms('locales'))->setField('locale')
        );

        $query->addAggregation(
            (new Terms('types'))->setField('type')
        );

        $query->addAggregation(
            (new Terms('categories'))->setField('categories')
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
            'locales'    => $result->getAggregation('locales')['buckets'],
            'types'      => $result->getAggregation('types')['buckets'],
            'categories' => $result->getAggregation('categories')['buckets'],
        ];

        return new JsonResponse(
            [
                'assets'  => $assets,
                'filters' => $filters,
            ]
        );
    }
}
