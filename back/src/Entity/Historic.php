<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Gedmo\Blameable\Traits\BlameableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\HistoricRepository")
 * @ORM\Table(name="historic")
 */
class Historic
{
    use BlameableEntity;
    use TimestampableEntity;

    /**
     * @var int|null
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     * @JMS\Type("integer")
     */
    protected $id;

    /**
     * @var int|null
     * @ORM\Column(type="integer", options={"default":0})
     */
    protected $timeCode = 0;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="historics")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @var Series|null
     * @ORM\ManyToOne(targetEntity="App\Entity\Series")
     * @ORM\JoinColumn(name="series_id", referencedColumnName="id")
     */
    protected $series;

    /**
     * @var Episode|null
     * @ORM\ManyToOne(targetEntity="App\Entity\Episode")
     * @ORM\JoinColumn(name="episode_id", referencedColumnName="id")
     */
    protected $episode;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     * @return self
     */
    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return int|null
     */
    public function getTimeCode()
    {
        return $this->timeCode;
    }

    /**
     * @param int|null $timeCode
     * @return $this
     */
    public function setTimeCode($timeCode)
    {
        $this->timeCode = $timeCode;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return $this
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Series|null
     */
    public function getSeries()
    {
        return $this->series;
    }

    /**
     * @param Series|null $series
     * @return $this
     */
    public function setSeries($series)
    {
        $this->series = $series;

        return $this;
    }

    /**
     * @return Episode|null
     */
    public function getEpisode()
    {
        return $this->episode;
    }

    /**
     * @param Episode|null $episode
     * @return $this
     */
    public function setEpisode($episode)
    {
        $this->episode = $episode;

        return $this;
    }
}
