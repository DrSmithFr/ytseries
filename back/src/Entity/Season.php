<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
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
     * @JMS\Type("integer")
     */
    protected $id;

    /**
     * @var int|null
     * @ORM\Column(type="integer")
     * @JMS\Type("integer")
     */
    protected $rank;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     * @JMS\Type("string")
     */
    protected $name;

    /**
     * @var string|null
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Type("string")
     */
    protected $importCode;

    /**
     * @JMS\Exclude()
     * @ORM\ManyToOne(targetEntity="App\Entity\Series", inversedBy="seasons", cascade={"persist"})
     * @ORM\JoinColumn(name="series_id", referencedColumnName="id")
     */
    protected $series;

    /**
     * @var ArrayCollection|Episode[]
     * @ORM\OneToMany(targetEntity="App\Entity\Episode", mappedBy="season", cascade={"persist", "remove"})
     * @JMS\Type("ArrayCollection<App\Entity\Episode>")
     */
    protected $episodes;

    public function __construct()
    {
        $this->episodes = new ArrayCollection();
    }

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
     * @return mixed
     */
    public function getImportCode()
    {
        return $this->importCode;
    }

    /**
     * @param mixed $importCode
     * @return $this
     */
    public function setImportCode($importCode)
    {
        $this->importCode = $importCode;

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

    public function __toString()
    {
        return $this->name;
    }
}
