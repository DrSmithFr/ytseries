<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Gedmo\Blameable\Traits\BlameableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SeriesRepository")
 * @ORM\Table(name="series")
 */
class Series
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
     * @var string|null
     * @ORM\Column(type="string")
     * @JMS\Type("string")
     */
    protected $name;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     * @JMS\Type("string")
     */
    protected $locale;

    /**
     * @var string|null
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Type("string")
     */
    protected $image;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     * @JMS\Type("string")
     */
    protected $description;

    /**
     * @var string|null
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Type("string")
     */
    protected $importCode;

    /**
     * @var SeriesType|null
     * @ORM\ManyToOne(targetEntity="App\Entity\SeriesType", inversedBy="series", cascade={"persist"})
     * @ORM\JoinColumn(name="series_type_id", referencedColumnName="id", nullable=true)
     * @JMS\Type("App\Entity\SeriesType")
     */
    protected $type;

    /**
     * @var ArrayCollection|Season[]
     * @ORM\OneToMany(targetEntity="App\Entity\Season", mappedBy="series", cascade={"persist", "remove"})
     * @JMS\Type("ArrayCollection<App\Entity\Season>")
     */
    protected $seasons;

    public function __construct()
    {
        $this->seasons = new ArrayCollection();
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
     * @return null|string
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * @param null|string $locale
     * @return $this
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getImage():? string
    {
        return $this->image;
    }

    /**
     * @param null|string $image
     * @return self
     */
    public function setImage(?string $image): self
    {
        $this->image = $image;
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
     * @return null|string
     */
    public function getImportCode()
    {
        return $this->importCode;
    }

    /**
     * @param null|string $importCode
     * @return $this
     */
    public function setImportCode($importCode)
    {
        $this->importCode = $importCode;

        return $this;
    }

    /**
     * @return Season[]|ArrayCollection
     */
    public function getSeasons()
    {
        return $this->seasons;
    }

    /**
     * @param Season[]|ArrayCollection $seasons
     * @return $this
     */
    public function setSeasons($seasons)
    {
        $this->seasons = $seasons;

        return $this;
    }

    /**
     * @param Season $season
     * @return $this
     */
    public function addSeason(Season $season)
    {
        if (! $this->seasons->contains($season)) {
            $this->seasons->add($season);
            $season->setSeries($this);
        }

        return $this;
    }

    /**
     * @param Season $season
     * @return $this
     */
    public function removeSeason(Season $season)
    {
        $this->seasons->removeElement($season);
        $season->setSeries(null);

        return $this;
    }

    /**
     * @return SeriesType|null
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param SeriesType $type
     * @return self
     */
    public function setType($type): self
    {
        $this->type = $type;
        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }
}
