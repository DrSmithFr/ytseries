<?php

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
     * @var string|null
     * @ORM\Column(type="string")
     *
     * @JMS\Expose()
     * @JMS\Type("string")
     */
    protected $description;

    /**
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
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param null|string $code
     * @return $this
     */
    public function setCode($code)
    {
        $this->code = $code;

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
    public function getSeason()
    {
        return $this->season;
    }

    /**
     * @param mixed $season
     * @return $this
     */
    public function setSeason($season)
    {
        $this->season = $season;

        return $this;
    }

    public function __toString()
    {
        return sprintf('[%d] - %s', $this->rank, $this->name);
    }
}
