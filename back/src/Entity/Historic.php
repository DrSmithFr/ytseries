<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Gedmo\Blameable\Traits\BlameableEntity;
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
    public function getTimeCode(): ?int
    {
        return $this->timeCode;
    }

    /**
     * @param int|null $timeCode
     * @return self
     */
    public function setTimeCode(?int $timeCode): self
    {
        $this->timeCode = $timeCode;
        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return self
     */
    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return Series|null
     */
    public function getSeries(): ?Series
    {
        return $this->series;
    }

    /**
     * @param Series|null $series
     * @return self
     */
    public function setSeries(?Series $series): self
    {
        $this->series = $series;
        return $this;
    }

    /**
     * @return Episode|null
     */
    public function getEpisode(): ?Episode
    {
        return $this->episode;
    }

    /**
     * @param Episode|null $episode
     * @return self
     */
    public function setEpisode(?Episode $episode): self
    {
        $this->episode = $episode;
        return $this;
    }
}
