<?php

namespace App\Service;

use App\Entity\Episode;
use Madcoda\Youtube\Youtube;

class YoutubeService
{

    /**
     * @var string
     */
    private $apiKey;

    /**
     * @var
     */
    private $youtube;

    /**
     * YoutubeService constructor.
     * @param string $apiKey
     * @throws \Exception
     */
    public function __construct(string $apiKey)
    {
        $this->apiKey  = $apiKey;
        $this->youtube = new Youtube(['key' => $apiKey]);
    }

    /**
     * @param string $code
     * @return array
     * @throws \Exception
     */
    public function getPlaylistInfo(string $code, string $page = null) : array
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
        $data  = [];

        foreach ($infos['results'] as $info) {
            $data[] = [
                'name' => $info->snippet->title,
                'code' => $info->snippet->resourceId->videoId,
            ];
        }

        if ($token = $infos['info']['nextPageToken']) {
            $data = array_merge($data, $this->getPlaylistInfo($code, $token));
        }

        return $data;
    }

    public function getVideoDuration(Episode $episode):? int
    {
        $API_URL = $this->youtube->getApi('videos.list');
        $params = array(
            'id' => $episode->getCode(),
            'part' => 'contentDetails'
        );

        $apiData = $this->youtube->api_get($API_URL, $params);
        $data = $this->youtube->decodeSingle($apiData);

        if (!$data) {
            return null;
        }

        $duration = $data->contentDetails->duration;
        $hours = (new \DateInterval($duration))->h;
        $minutes = (new \DateInterval($duration))->i;
        $seconds  = (new \DateInterval($duration))->s;

        return $hours * 3600 + $minutes * 60 + $seconds;
    }
}