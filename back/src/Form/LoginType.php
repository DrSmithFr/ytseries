<?php

namespace App\Form;

use App\Model\LoginModel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class LoginType extends AbstractType
{
    /**
     * $option parameter is mandatory but not used
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add(
                'username',
                EmailType::class,
                [
                    'required'    => true,
                    'constraints' => [
                        new Email(),
                    ],
                ]
            )
            ->add(
                'password',
                PasswordType::class,
                [
                    'required'    => true,
                    'constraints' => [
                        new Length(['min' => 4]),
                    ],
                ]
            );
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class'      => LoginModel::class,
                'csrf_protection' => false,
            ]
        );
    }
}
