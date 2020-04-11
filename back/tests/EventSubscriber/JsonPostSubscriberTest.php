<?php

namespace App\EventSubscriber;

use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Tests\TestCase;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class JsonPostSubscriberTest extends TestCase
{
    /**
     * @var JsonPostSubscriber
     */
    private $service;

    protected function setUp(): void
    {
        $this->service = new JsonPostSubscriber();
    }

    public function testNotJsonType()
    {
        $request = $this
            ->createMock(Request::class);

        $request
            ->expects(self::once())
            ->method('getContentType')
            ->willReturn('xml');

        $request
            ->expects(self::never())
            ->method('getContent');

        /** @var ControllerEvent|MockObject $event */
        $event = $this
            ->createMock(ControllerEvent::class);

        $event
            ->expects(self::once())
            ->method('getRequest')
            ->willReturn($request);

        $this->service->convertJsonStringToArray($event);
    }

    public function testBadJsonType()
    {
        $request = $this
            ->createMock(Request::class);

        $request
            ->expects(self::once())
            ->method('getContentType')
            ->willReturn('json');

        $request
            ->expects(self::exactly(2))
            ->method('getContent')
            ->willReturn('{');

        /** @var ControllerEvent|MockObject $event */
        $event = $this
            ->createMock(ControllerEvent::class);

        $event
            ->expects(self::once())
            ->method('getRequest')
            ->willReturn($request);

        $this->expectException(BadRequestHttpException::class);
        $this->service->convertJsonStringToArray($event);
    }

    public function testGoodJsonType()
    {
        $request = $this
            ->getMockBuilder(Request::class)
            ->disableOriginalConstructor()
            ->getMock();

        $request
            ->expects(self::once())
            ->method('getContentType')
            ->willReturn('json');

        $request
            ->expects(self::exactly(2))
            ->method('getContent')
            ->willReturn('{"test":true}');

        $param = $this
            ->createMock(ParameterBag::class);

        $param
            ->expects(self::once())
            ->method('replace')
            ->with(['test' => true]);

        $request->request = $param;

        /** @var ControllerEvent|MockObject $event */
        $event = $this
            ->createMock(ControllerEvent::class);

        $event
            ->expects(self::once())
            ->method('getRequest')
            ->willReturn($request);

        $this->service->convertJsonStringToArray($event);
    }
}
