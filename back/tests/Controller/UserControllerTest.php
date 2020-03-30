<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    protected function setUp()
    {
        self::bootKernel();
    }

    protected function tearDown()
    {
        parent::tearDown();
    }

    public function testRegisterGood()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"email":"another@mpp.fr","password":"test"}'
        );

        $this->assertTrue($client->getResponse()->isSuccessful(), 'cannot create account');
    }

    public function testRegisterEmailAlreadyUsed()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"email":"admin@mpp.fr","password":"test"}'
        );

        $this->assertEquals(
            Response::HTTP_BAD_REQUEST,
            $client->getResponse()->getStatusCode(),
            'can recreate existing account'
        );
    }

    public function testRegisterBadEmail()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"email":"another@fr","password":"test"}'
        );

        $this->assertFalse(
            $client->getResponse()->isSuccessful(),
            'can create account with bad email'
        );
    }

    public function testRegisterBadPassword()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"email":"another-2@mpp.fr","password":"123"}'
        );

        $this->assertFalse(
            $client->getResponse()->isSuccessful(),
            'can create account with bad password length'
        );
    }

    public function testLoginBadCredencial()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/connect',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"username":"another-2@mpp.fr","password":"123"}'
        );

        $this->assertEquals(
            Response::HTTP_UNAUTHORIZED,
            $client->getResponse()->getStatusCode(),
            'can connect with bad credential'
        );
    }

    public function testLogin()
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/users/connect',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            '{"username":"user@mpp.fr","password":"test"}'
        );

        $this->assertEquals(
            Response::HTTP_OK,
            $client->getResponse()->getStatusCode(),
            'cannot connect with user credential'
        );
    }
}
