<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Episode;
use DateInterval;
use Exception;
use Madcoda\Youtube\Youtube;

class YoutubeService
{
    /**
     * @var
     */
    private $youtube;

    /**
     * YoutubeService constructor.
     *
     * @param string $apiKey
     * @throws Exception
     */
    public function __construct(string $apiKey)
    {
        $this->youtube = new Youtube(['key' => $apiKey]);
    }

    /**
     * @param string      $code
     * @param string|null $page
     * @return array
     * @throws Exception
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

        return [
            'name'        => ucfirst(strtolower($firstEp->snippet->title)),
            'locale'      => 'fr',
            'type'        => 'series',
            'images'      => $firstEp->snippet->thumbnails->maxres->url,
            'description' => $firstEp->snippet->description,
            'categories'  => [],
            'season'      => [
                'name'     => 'Saison 1',
                'episodes' => $data,
            ],
        ];
    }

    /**
     * @param Episode $episode
     * @return int|null
     * @throws Exception
     */
    public function getVideoDuration(Episode $episode): ?int
    {
        $API_URL = $this->youtube->getApi('videos.list');
        $params  = [
            'id'   => $episode->getCode(),
            'part' => 'contentDetails',
        ];

        $apiData = $this->youtube->api_get($API_URL, $params);
        $data    = $this->youtube->decodeSingle($apiData);

        if (!$data) {
            return null;
        }

        $duration = $data->contentDetails->duration;
        $hours    = (new DateInterval($duration))->h;
        $minutes  = (new DateInterval($duration))->i;
        $seconds  = (new DateInterval($duration))->s;

        return $hours * 3600 + $minutes * 60 + $seconds;
    }
}
