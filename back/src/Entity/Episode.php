<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Gedmo\Blameable\Traits\BlameableEntity;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EpisodeRepository")
 * @ORM\Table(name="episodes")
 */
class Episode
{
    use BlameableEntity;
    use TimestampableEntity;

    /**
     * @var int|null
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @JMS\Expose()
     * @JMS\Type("integer")
     */
    protected $id;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     *
     * @JMS\Expose()
     * @JMS\Type("string")
     */
    protected $code;

    /**
     * @var int|null
     * @ORM\Column(type="integer")
     *
     * @JMS\Expose()
     * @JMS\Type("integer")
     */
    protected $rank;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     *
     * @JMS\Expose()
     * @JMS\Type("string")
     */
    protected $name;

    /**
     * @var int|null
     * @ORM\Column(type="integer", nullable=true)
     *
     * @JMS\Expose()
     * @JMS\Type("integer")
     */
    protected $duration;

    /**
     * @var string|null
     * @ORM\Column(type="string", nullable=true)
     * @JMS\Type("string")
     */
    protected $importCode;

    /**
     * @var Season|null
     * @JMS\Exclude()
     * @ORM\ManyToOne(targetEntity="App\Entity\Season", inversedBy="episodes", cascade={"persist"})
     * @ORM\JoinColumn(name="season_id", referencedColumnName="id")
     */
    protected $season;

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
    public function getCode(): ?string
    {
        return $this->code;
    }

    /**
     * @param string|null $code
     * @return self
     */
    public function setCode(?string $code): self
    {
        $this->code = $code;
        return $this;
    }

    /**
     * @return int|null
     */
    public function getRank(): ?int
    {
        return $this->rank;
    }

    /**
     * @param int|null $rank
     * @return self
     */
    public function setRank(?int $rank): self
    {
        $this->rank = $rank;
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
     * @return int|null
     */
    public function getDuration(): ?int
    {
        return $this->duration;
    }

    /**
     * @param int|null $duration
     * @return self
     */
    public function setDuration(?int $duration): self
    {
        $this->duration = $duration;
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
     * @return Season|null
     */
    public function getSeason(): ?Season
    {
        return $this->season;
    }

    /**
     * @param Season|null $season
     * @return self
     */
    public function setSeason(?Season $season): self
    {
        $this->season = $season;
        return $this;
    }

    public function __toString()
    {
        return sprintf('[%d] - %s', $this->rank, $this->name);
    }
}
