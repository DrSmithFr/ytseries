import { afterNextRender, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/api/auth.service';
import { Roles } from '../../guards/auth.guard';

import { RouterModule } from '@angular/router';
import { Page } from '../../components/page/page';

@Component({
  selector: 'app-not-found',
  standalone: true,
             imports: [RouterModule, Page],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {
  public isLogged = false;

  constructor(
    private authService: AuthService
  ) {
    afterNextRender(() => {
      this.authService.getUserSubject().subscribe((user) => {
        this.isLogged = user?.roles.includes(Roles.user) ?? false;
      });
    })
  }
}
