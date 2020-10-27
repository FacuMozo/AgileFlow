import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const DEFAULT_LANG = 'es-AR';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-bootcamp';

  constructor(translate: TranslateService) {
    translate.setDefaultLang(DEFAULT_LANG);
  }
}
