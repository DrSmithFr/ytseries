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
     * @var Collection|Season[]
     * @ORM\OneToMany(targetEntity="App\Entity\Season", mappedBy="series", cascade={"persist", "remove"})
     * @JMS\Type("ArrayCollection<App\Entity\Season>")
     */
    protected $seasons;

    /**
     * @var Collection|Category[]
     * @ORM\ManyToMany(targetEntity="Category", inversedBy="series")
     * @ORM\JoinTable(
     *  name="mtm_series_to_categories",
     *  joinColumns={
     *      @ORM\JoinColumn(name="series_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *     @ORM\JoinColumn(name="category_id", referencedColumnName="id")
     *  }
     * )
     * @JMS\Type("ArrayCollection<App\Entity\Category>")
     */
    protected $categories;

    /**
     * @var array|null
     * @ORM\Column(type="simple_array", nullable=true)
     * @JMS\Type("array<string>")
     */
    protected $tags;

    public function __construct()
    {
        $this->seasons = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->tags = [];
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
    public function getLocale(): ?string
    {
        return $this->locale;
    }

    /**
     * @param string|null $locale
     * @return self
     */
    public function setLocale(?string $locale): self
    {
        $this->locale = $locale;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getImage(): ?string
    {
        return $this->image;
    }

    /**
     * @param string|null $image
     * @return self
     */
    public function setImage(?string $image): self
    {
        $this->image = $image;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     * @return self
     */
    public function setDescription(?string $description): self
    {
        $this->description = $description;
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
     * @return SeriesType|null
     */
    public function getType(): ?SeriesType
    {
        return $this->type;
    }

    /**
     * @param SeriesType|null $type
     * @return self
     */
    public function setType(?SeriesType $type): self
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return Season[]|Collection
     */
    public function getSeasons()
    {
        return $this->seasons;
    }

    /**
     * @param Season[]|Collection $seasons
     * @return self
     */
    public function setSeasons($seasons)
    {
        $this->seasons = $seasons;
        return $this;
    }

    /**
     * @return Category[]|Collection
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * @param Category[]|Collection $categories
     * @return self
     */
    public function setCategories($categories)
    {
        $this->categories = $categories;
        return $this;
    }

    /**
     * @return array|null
     */
    public function getTags(): ?array
    {
        return $this->tags;
    }

    /**
     * @param array|null $tags
     * @return self
     */
    public function setTags(?array $tags): self
    {
        $this->tags = $tags;
        return $this;
    }

    /**
     * @param Season $season
     * @return self
     */
    public function addSeason(Season $season): self
    {
        $this->seasons->add($season);
        $season->setSeries($this);
        return $this;
    }

    /**
     * @param Season $season
     * @return self
     */
    public function removeSeason(Season $season): self
    {
        $this->seasons->removeElement($season);
        $season->setSeries(null);
        return $this;
    }

    /**
     * @param Category $category
     * @return self
     */
    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
        }

        return $this;
    }

    /**
     * @param Category $category
     * @return self
     */
    public function removeCategory(Category $category): self
    {
        $this->categories->removeElement($category);
        return $this;
    }

    /**
     * @param mixed $tag
     * @return self
     */
    public function addTag($tag): self
    {
        $this->tags[] = $tag;
        return $this;
    }

    /**
     * @param mixed $tag
     * @return self
     */
    public function removeTag($tag): self
    {
        if (false !== $key = array_search($tag, $this->tags, true)) {
            array_splice($this->tags, $key, 1);
        }

        return $this;
    }


    public function __toString()
    {
        return $this->name ?? '';
    }
}
