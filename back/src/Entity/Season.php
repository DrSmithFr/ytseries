<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Gedmo\Blameable\Traits\BlameableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SeasonRepository")
 * @ORM\Table(name="seasons")
 */
class Season
{
    use BlameableEntity;
    use TimestampableEntity;

    /**
     * @var int|null
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var int|null
     * @ORM\Column(type="integer")
     */
    protected $rank;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Series", inversedBy="saisons", cascade={"persist"})
     * @ORM\JoinColumn(name="series_id", referencedColumnName="id")
     */
    protected $series;

    /**
     * @var ArrayCollection|Episode[]
     * @ORM\OneToMany(targetEntity="App\Entity\Episode", mappedBy="saison", cascade={"persist", "remove"})
     */
    protected $episodes;

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
     * @return null|string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param null|string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param null|string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Series|null
     */
    public function getSeries():? Series
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
     * @return int|null
     */
    public function getRank()
    {
        return $this->rank;
    }

    /**
     * @param int|null $rank
     * @return $this
     */
    public function setRank($rank)
    {
        $this->rank = $rank;

        return $this;
    }

    /**
     * @return Episode[]|ArrayCollection
     */
    public function getEpisodes()
    {
        return $this->episodes;
    }

    /**
     * @param Episode[]|ArrayCollection $episodes
     * @return $this
     */
    public function setEpisodes($episodes)
    {
        $this->episodes = $episodes;

        return $this;
    }

    /**
     * @param Episode $episode
     * @return $this
     */
    public function addEpisode(Episode $episode)
    {
        if (! $this->episodes->contains($episode)) {
            $this->episodes->add($episode);
            $episode->setSeason($this);
        }

        return $this;
    }

    /**
     * @param Episode $episode
     * @return $this
     */
    public function removeEpisode(Episode $episode)
    {
        $this->episodes->removeElement($episode);
        $episode->setSeason(null);

        return $this;
    }

}
