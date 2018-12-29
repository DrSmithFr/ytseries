<?php

namespace App\Model;

class UserCounterModel
{
    private $total = -1;
    private $active = -1;

    /**
     * @return int
     */
    public function getTotal() : int
    {
        return $this->total;
    }

    /**
     * @param int $total
     * @return $this
     */
    public function setTotal(int $total): self
    {
        $this->total = $total;
        return $this;
    }

    /**
     * @return int
     */
    public function getActive() : int
    {
        return $this->active;
    }

    /**
     * @param int $active
     * @return $this
     */
    public function setActive(int $active): self
    {
        $this->active = $active;
        return $this;
    }
}
