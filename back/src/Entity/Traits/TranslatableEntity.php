<?php

namespace App\Entity\Traits;

trait TranslatableEntity
{
    /**
     * @Gedmo\Locale
     * Used locale to override Translation listener`s locale
     * this is not a mapped field of entity metadata, just a simple property
     */
    protected $locale;

    /**
     * @return string
     */
    public function getTranslatableLocale()
    {
        return $this->locale;
    }

    /**
     * @param $locale
     * @return self
     */
    public function setTranslatableLocale($locale)
    {
        $this->locale = $locale;
        return $this;
    }
}
