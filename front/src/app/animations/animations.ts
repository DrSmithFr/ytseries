import {animate, group, query, style} from '@angular/animations';

export const slideIn = [
    query(
        ':enter, :leave',
        style({position: 'fixed', width: '100%'}),
        {optional: true}
    ),
    group(
        [
            query(
                ':enter',
                [
                    style({transform: 'translateX(100%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
                ],
                {optional: true}
            ),
            query(
                ':leave',
                [
                    style({transform: 'translateX(0%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
                ],
                {optional: true}
            ),
        ]
    )
];


export const slideOut = [
    query(
        ':enter, :leave',
        style({position: 'fixed', width: '100%', height: '100vh'}),
        {optional: true}
    ),
    group(
        [
            query(
                ':enter',
                [
                    style({transform: 'translateX(-100%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
                ],
                {optional: true}
            ),
            query(
                ':leave',
                [
                    style({transform: 'translateX(0%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
                ],
                {optional: true}
            ),
        ]
    )
];

export const fallIn = [
    query(
        ':enter, :leave',
        style({position: 'fixed', width: '100%', height: '100vh'}),
        {optional: true}
    ),
    group(
        [
            query(
                ':enter',
                [
                    style({transform: 'translateY(-100%)'}),
                    animate('0.5s'),
                    animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
                ],
                {optional: true}
            ),
            query(
                ':leave',
                [
                    style({transform: 'translateY(0%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateY(100%)', opacity: '0'}))
                ],
                {optional: true}
            ),
        ]
    )
];

export const popOut = [
    query(
        ':enter, :leave',
        style({position: 'fixed', width: '100%'}),
        {optional: true}
    ),
    group(
        [
            query(
                ':enter',
                [
                    style({transform: 'translateY(100%)'}),
                    animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
                ],
                {optional: true}
            ),
            query(
                ':leave',
                [
                    style({opacity: 1}),
                    animate('100ms', style({opacity: 0}))
                ],
                {optional: true}
            ),
        ]
    )
];

export const fadeIn = [
    query(
        ':enter, :leave',
        style({position: 'fixed', width: '100%'}),
        {optional: true}
    ),
    group(
        [
            query(
                ':enter',
                [
                    style({opacity: 0}),
                    animate('800ms', style({opacity: 1}))
                ],
                {optional: true}
            ),
            query(
                ':leave',
                [
                    style({opacity: 1}),
                    animate('100ms', style({opacity: 0}))
                ],
                {optional: true}
            ),
        ]
    )
];
