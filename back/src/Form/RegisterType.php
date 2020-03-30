<?php

namespace App\Form;

use App\Model\RegisterModel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class RegisterType extends AbstractType
{
    /**
     * $option parameter is mandatory but not used
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     *
     * @uses validateCoupon
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add(
                'username',
                EmailType::class,
                [
                    'required' => true,
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
            )
            ->add(
                'coupon',
                TextType::class,
                [
                    'constraints' => [
                        new Callback([$this, 'validateCoupon']),
                    ],
                ]
            );
    }

    /**
     * @param string|null               $coupon
     * @param ExecutionContextInterface $context
     */
    public function validateCoupon($coupon, ExecutionContextInterface $context)
    {
        if ($coupon === null) {
            // allow empty data
            return;
        }

        // validate coupon against database
        if (true) {
            $context
                ->buildViolation('coupon not found')
                ->atPath('coupon')
                ->addViolation();
        }
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'data_class'      => RegisterModel::class,
                'csrf_protection' => false,
            ]
        );
    }
}
