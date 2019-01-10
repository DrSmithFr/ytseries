<?php

namespace App\Entity;

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
     * @ORM\OneToMany(targetEntity="App\Entity\Historic", mappedBy="user", cascade={"remove"})
     * @var ArrayCollection
     */
    private $historics;

    public function __construct()
    {
        $this->groups = new ArrayCollection();
        $this->historics = new ArrayCollection();

        parent::__construct();
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
     * @return ArrayCollection
     */
    public function getGroups()
    {
        return $this->groups;
    }

    /**
     * @param ArrayCollection $groups
     * @return self
     */
    public function setGroups($groups): self
    {
        $this->groups = $groups;
        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getHistorics() : ArrayCollection
    {
        return $this->historics;
    }

    /**
     * @param ArrayCollection $historics
     * @return $this
     */
    public function setHistorics(ArrayCollection $historics)
    {
        $this->historics = $historics;

        return $this;
    }

    /**
     * @param mixed $historic
     * @return $this
     */
    public function addHistoric($historic)
    {
        if (! $this->historics->contains($historic)) {
            $this->historics->add($historic);
            $historic->setUser($this);
        }

        return $this;
    }

    /**
     * @param mixed $historic
     * @return $this
     */
    public function removeHistoric($historic)
    {
        $this->historics->removeElement($historic);
        $historic->setUser(null);

        return $this;
    }
}
