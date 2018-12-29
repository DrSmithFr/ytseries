<?php

namespace App\Controller;

use App\Repository\MapBackgroundRepository;
use App\Service\AssetSearchService;
use JMS\Serializer\SerializerBuilder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;

use Elastica\Query;
use Elastica\Query\BoolQuery;
use Elastica\Query\MultiMatch;

/**
 * @Route("/api/asset")
 */
class AssetsController extends BaseAdminController
{
    /**
     * @Route("/search", name="api_asset_search")
     * @param Request            $request
     * @param AssetSearchService $searchService
     * @return JsonResponse
     */
    public function getBackgroundLayersAction(
        Request $request,
        AssetSearchService $searchService
    ) {
        $query = new Query();

        if ($q = $request->get('query')) {
            // add exact match query
            $match = new MultiMatch();
            $match->setQuery($q);
            $match->setFields(["name^2", "code"]);
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
                    'fields' => [
                        'code' => new \stdClass(),
                        'name' => new \stdClass()
                    ]
                ]
            );
        } else {
            $query->setQuery(new Query\MatchAll());
        }

        $query->setSize(10);

        $result = $searchService->getIndex()->search($query);

        $results = [];
        foreach ($result as $asset) {
            $assetData = $asset->getSource();

            $highlights = $asset->getHighlights();

            if (isset($highlights['name'])) {
                $assetData['name'] = $highlights['name'][0];
            }

            $results[] = $assetData;
        }

        return new JsonResponse($results);
    }
}
