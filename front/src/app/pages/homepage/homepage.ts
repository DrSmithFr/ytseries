import { afterNextRender, Component, HostListener, inject, viewChild } from '@angular/core';
import { HeroBanner } from '../../components/hero-banner/hero-banner';
import { BlobBackground } from '../../components/blob-background/blob-background';
import { MovieList } from '../../components/movie-list/movie-list';
import { TopTen } from '../../components/top-ten/top-ten';
import { SeriesMapper, SeriesModel } from '../../models/movies/series.model';
import { Footer } from '../../components/footer/footer';
import { Navigation } from '../../components/navigation/navigation';
import { MatDialog } from '@angular/material/dialog';
import { FaqDialog } from '../../modals/faq/faq-dialog.component';
import { CookieService } from '../../services/cookies/cookie.service';

@Component(
  {
    selector: 'app-homepage',
    imports: [
      HeroBanner,
      BlobBackground,
      MovieList,
      TopTen,
      Footer,
      Navigation
    ],
    templateUrl: './homepage.html',
    standalone: true,
    styleUrl: './homepage.scss'
  }
)
export class Homepage {
  mock_movies: SeriesModel[] = inject(SeriesMapper).fromDtos(
    [
      {
        'import_code': 'real_cops',
        'locale': 'fr',
        'name': 'Real Cops',
        'image': 'https:\/\/img.youtube.com\/vi\/J9tAYZeKCRM\/maxresdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'Apr\u00e8s une nuit de f\u00eate, c\u2019est l\u2019heure de l\u2019after \u00e0 l\u2019Armagedance. Mais pour les acharn\u00e9s qui refusent de quitter le dance floor, le pire est \u00e0 venir...',
        'categories': [
          'Humour'
        ],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'dead_floor',
        'locale': 'fr',
        'name': 'DEAD FLOOR',
        'image': 'https:\/\/img.youtube.com\/vi\/j-4Cbv71nuw\/maxresdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'Apr\u00e8s une nuit de f\u00eate, c\u2019est l\u2019heure de l\u2019after \u00e0 l\u2019Armagedance. Mais pour les acharn\u00e9s qui refusent de quitter le dance floor, le pire est \u00e0 venir...',
        'categories': [
          'Thriller',
          'Drame',
          'Action',
          'Aventure'
        ],
        'tags': [
          'zombie',
          'musique'
        ],
        'import_date': 1758879966
      },
      {
        'import_code': 'dead_lands',
        'locale': 'fr',
        'name': 'Dead Landes',
        'image': 'https:\/\/img.youtube.com\/vi\/sWS5beMd18I\/mqdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'C\u0027est la fin de l\u0027\u00e9t\u00e9 \u00e0 l\u0027Escapade, dans un petit camping au bord de la faillite au c\u0153ur des Landes de myst\u00e9rieuses catastrophes surviennent...',
        'categories': [
          'Thriller',
          'Science fiction',
          'Drame',
          'Aventure'
        ],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'what_the_cut',
        'locale': 'fr',
        'name': 'WHAT THE CUT',
        'image': 'https:\/\/img.youtube.com\/vi\/OsAT9DPNC4Q\/mqdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'L\u0027emition d\u0027antoine daniel,  Review de vid\u00e9os du net.',
        'categories': [
          'Humour'
        ],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'identifier',
        'locale': 'us',
        'name': 'Ctrl alt del',
        'image': 'https:\/\/i.ytimg.com\/vi\/RJEeTH3gQjU\/maxresdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'Time for a love story reset. The first episode from our first ever web series. Watch and Enjoy.',
        'categories': [
          'Romantique'
        ],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'salade_fingers',
        'locale': 'us',
        'name': 'Salad fingers',
        'image': 'https:\/\/i.ytimg.com\/vi\/OWBFKL6H7rI\/sddefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'Salad Fingers goes on the lookout for the perfect spoon.',
        'categories': [
          'Humour',
          'Horreur'
        ],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'eighty-sixed',
        'locale': 'us',
        'name': 'Eighty-sixed',
        'image': 'https:\/\/i.ytimg.com\/vi\/2qNX97CtgSQ\/maxresdefault.jpg',
        'type': 'S\u00e9ries',
        'description': 'Remi gets dumped and her friends attempts to console her only makes things worse.',
        'categories': [],
        'tags': [],
        'import_date': 1758879966
      },
      {
        'import_code': 'les_dissocies',
        'locale': 'fr',
        'name': 'Les Dissoci\u00e9s',
        'image': 'https:\/\/img.youtube.com\/vi\/5lUBlW72qBQ\/maxresdefault.jpg',
        'type': 'Film',
        'description': 'Apr\u00e8s s\u2019\u00eatre fait voler leur corps, Lily et Ben vont explorer un monde o\u00f9 le corps ne compte plus et dans lequel leur \u00e2me sera mise \u00e0 l\u2019\u00e9preuve.',
        'categories': [
          'Thriller',
          'Aventure',
          'Humour'
        ],
        'tags': [
          'preview',
          'youtube'
        ],
        'import_date': 1758879966
      },
      {
        'import_code': 'lunar',
        'locale': 'fr',
        'name': 'Lunar',
        'image': 'https:\/\/img.youtube.com\/vi\/9qvNtzr0nqU\/maxresdefault.jpg',
        'type': 'Court m\u00e9trage',
        'description': 'Un homme braque la mauvaise famille...',
        'categories': [
          'Thriller'
        ],
        'tags': [],
        'import_date': 1758879966
      },
    ]
  )

  heroBanner = viewChild.required<HeroBanner>('heroBanner');

  POPOVER_WELCOME_COOKIE = 'ninja-autoplay-tricks'

  constructor(
    public dialog: MatDialog,
    private cookieService: CookieService,
  ) {
    afterNextRender(() => {
      this.showStartupModal()
    })
  }

  showStartupModal() {
    const hidePopover = this.cookieService.check(this.POPOVER_WELCOME_COOKIE)

    if (hidePopover) {
      // avoid multiple display of welcome popover
      return
    }

    this
      .dialog
      .open(FaqDialog)
      .afterClosed()
      .subscribe(() => {
        // Use the click to ensure video starting
        this.heroBanner().startVideo()

        // disable popover for next 30 minutes
        const expire = new Date()
        expire.setMinutes(expire.getMinutes() + 30);

        this.cookieService.set(this.POPOVER_WELCOME_COOKIE, 'nope', {expires: expire})
      })
  }
}
