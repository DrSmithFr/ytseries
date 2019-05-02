<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
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
     * @var Collection|Series[]
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
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     * @return self
     */
    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getImportCode(): ?string
    {
        return $this->importCode;
    }

    /**
     * @param string|null $importCode
     * @return self
     */
    public function setImportCode(?string $importCode): self
    {
        $this->importCode = $importCode;
        return $this;
    }

    /**
     * @return Series[]|Collection
     */
    public function getSeries(): Collection
    {
        return $this->series;
    }

    /**
     * @param Series[]|Collection $series
     * @return self
     */
    public function setSeries(Collection $series): self
    {
        $this->series = $series;
        return $this;
    }

    /**
     * @param Series $series
     * @return self
     */
    public function addSeries(Series $series): self
    {
        $this->series->add($series);
        $series->setType($this);
        return $this;
    }

    /**
     * @param Series $series
     * @return self
     */
    public function removeSeries(Series $series): self
    {
        $this->series->removeElement($series);
        $series->setType(null);
        return $this;
    }

    public function __toString()
    {
        return $this->name ?? '';
    }
}
