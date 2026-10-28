<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Service\SearchService;
use Elastica\Aggregation\Terms;
use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MatchQuery;
use Elastica\Query\MultiMatch;
use Elastica\Result;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{
    #[Route('/public/search', name: 'api_search_series', methods: ['GET'])]
    public function getBackgroundLayersAction(
        Request $request,
        SearchService $searchService
    ): JsonResponse {
        $result = $searchService->getIndex()->search(self::buildQuery($request));

        return new JsonResponse(
            [
                'assets'  => self::extractAssets($result),
                'filters' => [
                    'locales'    => $result->getAggregation('locales')['buckets'],
                    'types'      => $result->getAggregation('types')['buckets'],
                    'categories' => $result->getAggregation('categories')['buckets'],
                ],
            ]
        );
    }

    /**
     * Elastica query: full text search + json filters + aggregations.
     */
    private static function buildQuery(Request $request): Query
    {
        $query = new Query();
        $customSearch = new BoolQuery();

        if ($search = $request->get('query')) {
            // add exact match query
            $match = new MultiMatch();

            $match->setQuery($search);
            $match->setFields(['name']);
            $match->setAnalyzer('standard');

            // add miss spell query
            $fuzzy = new Query\Fuzzy();
            $fuzzy->setField('name', $search);

            $customSearch->addMust(
                (new BoolQuery())
                    ->addShould($match)
                    ->addShould($fuzzy)
            );

            $query->setHighlight(
                [
                    'number_of_fragments' => 3,
                    'fragment_size'       => 255,
                    'fields'              => [
                        'name' => (object) [],
                    ],
                ]
            );
        } else {
            $customSearch->addMust(new Query\MatchAll());
        }

        self::addFilters($customSearch, $request);

        $query->setQuery($customSearch);

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

        return $query;
    }

    /**
     * "filters" request parameter: a json object field => value (or array of values).
     */
    private static function addFilters(BoolQuery $customSearch, Request $request): void
    {
        $jsonFilters = $request->get('filters');

        if (!$jsonFilters) {
            return;
        }

        foreach (json_decode($jsonFilters, true) as $field => $value) {
            if ($value === null) {
                continue;
            }

            foreach (is_array($value) ? $value : [$value] as $v) {
                $filterMatch = new MatchQuery();
                $filterMatch->setFieldQuery($field, $v);
                $customSearch->addMust($filterMatch);
            }
        }
    }

    /**
     * Source of every hit, with the highlighted name when there is one.
     */
    private static function extractAssets(Result $result): array
    {
        $assets = [];

        foreach ($result as $asset) {
            $assetData = $asset->getSource();

            $highlights = $asset->getHighlights();

            if (isset($highlights['name'])) {
                $assetData['name'] = $highlights['name'][0];
            }

            $assets[] = $assetData;
        }

        return $assets;
    }
}
