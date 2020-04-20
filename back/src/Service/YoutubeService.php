<?php

declare(strict_types = 1);

namespace App\Service;

use RuntimeException;
use App\Entity\Episode;
use DateInterval;
use Exception;
use Madcoda\Youtube\Youtube;
use Doctrine\Common\Collections\ArrayCollection;

class YoutubeService
{
    /**
     * @var
     */
    private $youtube;

    /**
     * YoutubeService constructor.
     *
     * @throws Exception
     *
     * @param string $apiKey
     */
    public function __construct(string $apiKey)
    {
        $this->youtube = new Youtube(['key' => $apiKey]);
    }

    /**
     * @throws Exception
     *
     * @param string|null $page
     * @param string      $code
     *
     * @return array
     */
    public function getPlaylistInfo(string $code, string $page = null): array
    {
        $params = [
            'playlistId' => $code,
            'part'       => 'id, snippet',
            'maxResults' => 50,
        ];

        if ($page) {
            $params['pageToken'] = $page;
        }

        $infos = $this->youtube->getPlaylistItemsByPlaylistIdAdvanced($params, true);

        $firstEp = null;
        $data    = [];

        foreach ($infos['results'] as $info) {
            if ($firstEp === null) {
                $firstEp = $info;
            }

            $data[] = [
                'name' => ucfirst(strtolower($info->snippet->title)),
                'code' => $info->snippet->resourceId->videoId,
            ];
        }

        if ($token = $infos['info']['nextPageToken']) {
            $data = array_merge($data, $this->getPlaylistInfo($code, $token));
        }

        $thumb = $firstEp->snippet->thumbnails->standard->url;

        if (isset($firstEp->snippet->thumbnails->maxres)) {
            $thumb = $firstEp->snippet->thumbnails->maxres->url;
        }

        return [
            'name'        => ucfirst(strtolower($firstEp->snippet->title)),
            'locale'      => 'fr',
            'type'        => 'series',
            'image'       => $thumb,
            'description' => $firstEp->snippet->description,
            'categories'  => [],
            'seasons'     => [
                [
                    'name'     => 'Saison 1',
                    'episodes' => $data,
                ],
            ],
        ];
    }

    /**
     * @throws Exception
     *
     * @param array|Episode[] $episodes
     *
     * @return array<string, int>
     */
    public function getVideoDuration(array $episodes): array
    {
        if (count($episodes) === 0) {
            throw new RuntimeException('cannot process without id');
        }

        if (count($episodes) > 50) {
            throw new RuntimeException('cannot process more than 50 episodes');
        }

        $API_URL = $this->youtube->getApi('videos.list');

        $codes = array_map(
            static function (Episode $ep) {
                return $ep->getCode();
            },
            $episodes
        );

        $params  = [
            'id'   => implode(',', $codes),
            'part' => 'contentDetails',
        ];

        $apiData = $this->youtube->api_get($API_URL, $params);
        $datas    = $this->youtube->decodeList($apiData);

        $result = [];

        foreach ($datas as $data) {
            $duration = $data->contentDetails->duration;
            $hours    = (new DateInterval($duration))->h;
            $minutes  = (new DateInterval($duration))->i;
            $seconds  = (new DateInterval($duration))->s;

            $result[$data->id] = $hours * 3600 + $minutes * 60 + $seconds;
        }

        return $result;
    }
}
