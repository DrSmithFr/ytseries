<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Gedmo\Blameable\Traits\BlameableEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="users")
 */
class User extends BaseUser
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
     * @var Collection|Group[]
     * @ORM\ManyToMany(targetEntity="App\Entity\Group")
     * @ORM\JoinTable(
     *  name="mtm_user_to_group",
     *  joinColumns={
     *      @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *     @ORM\JoinColumn(name="group_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $groups;

    /**
     * @var Collection|Historic[]
     * @ORM\OneToMany(targetEntity="App\Entity\Historic", mappedBy="user", cascade={"remove"})
     */
    private $historics;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
        $this->historics = new ArrayCollection();

        parent::__construct();
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
     * @return Collection
     */
    public function getGroups(): Collection
    {
        return $this->groups;
    }

    /**
     * @param Collection $groups
     * @return self
     */
    public function setGroups(Collection $groups): self
    {
        $this->groups = $groups;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getHistorics(): Collection
    {
        return $this->historics;
    }

    /**
     * @param Collection $historics
     * @return self
     */
    public function setHistorics(Collection $historics): self
    {
        $this->historics = $historics;

        return $this;
    }

    /**
     * @param Historic $historic
     * @return self
     */
    public function addHistoric(Historic $historic): self
    {
        if (!$this->historics->contains($historic)) {
            $this->historics->add($historic);
            $historic->setUser($this);
        }

        return $this;
    }

    /**
     * @param Historic $historic
     * @return self
     */
    public function removeHistoric(Historic $historic): self
    {
        $this->historics->removeElement($historic);
        $historic->setUser(null);

        return $this;
    }
}
