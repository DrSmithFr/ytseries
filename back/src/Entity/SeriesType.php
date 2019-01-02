<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Gedmo\Blameable\Traits\BlameableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SeriesTypeRepository")
 * @ORM\Table(name="series_type")
 */
class SeriesType
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
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Type("string")
     */
    protected $importCode;

    /**
     * @var ArrayCollection|Series[]
     * @ORM\OneToMany(targetEntity="App\Entity\Series", mappedBy="type")
     * @JMS\Exclude()
     */
    protected $series;

    public function __construct()
    {
        $this->series = new ArrayCollection();
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
     * @param Series $series
     * @return self
     */
    public function addSeries(Series $series)
    {
        $this->series->add($series);
        $series->setType($this);
        return $this;
    }

    /**
     * @param Series $series
     * @return self
     */
    public function removeSeries(Series $series)
    {
        $this->series->removeElement($series);
        $series->setType(null);
        return $this;
    }


    /**
     * @return Series[]|ArrayCollection
     */
    public function getSeries()
    {
        return $this->series;
    }

    /**
     * @param Series[]|ArrayCollection $series
     * @return self
     */
    public function setSeries($series): self
    {
        $this->series = $series;
        return $this;
    }

    public function __toString()
    {
        return $this->name;
    }
}
