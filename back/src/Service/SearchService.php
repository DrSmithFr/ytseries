<?php

declare(strict_types = 1);

namespace App\Service;

use Elastica\Index;
use Elastica\Client;
use Elastica\Request;
use Elastica\Response;

class SearchService
{
    private $client;

    private $indexName;

    public function __construct(Client $client, string $elasticSearchIndexName)
    {
        $this->client    = $client;
        $this->indexName = $elasticSearchIndexName;
    }

    public function createTempIndex(): Index
    {
        $index = $this->getTempIndex();

        if ($index->exists()) {
            $index->delete();
        }

        $index->create($this->makeIndexConfiguration());

        return $index;
    }

    public function getTempIndex(): Index
    {
        return $this->client->getIndex(
            sprintf('%s_temp', $this->indexName)
        );
    }

    public function createIndex(): Index
    {
        $index = $this->getIndex();

        if ($index->exists()) {
            $index->delete();
        }

        $index->create($this->makeIndexConfiguration());

        return $index;
    }

    public function getIndex(): Index
    {
        return $this->client->getIndex($this->indexName);
    }

    public function switchTempIndexWithProduction(): Response
    {
        return $this->client->request(
            '_reindex',
            Request::POST,
            [
                'source' => [
                    'index' => sprintf('%s_temp', $this->indexName),
                ],
                'dest'   => [
                    'index' => $this->indexName,
                ],
            ]
        );
    }

    private function makeIndexConfiguration(): array
    {
        return [
            'settings' => $this->makeIndexSettings(),
            'mappings' => $this->makeAssetsMapping(),
        ];
    }

    private function makeIndexSettings(): array
    {
        return [
            'number_of_shards' => 1,
            'analysis'         => [
                'filter'   => [
                    'autocomplete_filter' => [
                        'type'     => 'edge_ngram',
                        'min_gram' => 1,
                        'max_gram' => 10,
                    ],
                ],
                'analyzer' => [
                    'autocomplete' => [
                        'type'      => 'custom',
                        'tokenizer' => 'standard',
                        'filter'    => [
                            'lowercase',
                            'autocomplete_filter',
                        ],
                    ],
                ],
            ],
        ];
    }

    private function makeAssetsMapping(): array
    {
        $properties = [];

        $properties['id'] = [
            'type' => 'keyword',
        ];

        $properties['import_date'] = [
            'type' => 'date',
        ];

        $properties['type'] = [
            'type' => 'keyword',
        ];

        $properties['categories'] = [
            'type' => 'keyword',
        ];

        $properties['locale'] = [
            'type' => 'keyword',
        ];

        $properties['name'] = [
            'type'     => 'text',
            'analyzer' => 'autocomplete',
        ];

        $properties['description'] = [
            'type'     => 'text',
            'analyzer' => 'autocomplete',
        ];

        return [
            'type_name' => [
                'properties' => $properties,
            ],
        ];
    }
}
