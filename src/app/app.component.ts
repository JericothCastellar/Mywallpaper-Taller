import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular/standalone';
import { I18nService } from '../app/core/services/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonButton
  ],
})
export class AppComponent implements OnInit {
  constructor(private i18n: I18nService) {}

  ngOnInit() {
    this.i18n.init();
  }

  t(key: string) {
    return this.i18n.translate(key);
  }

  cambiarIdioma(lang: string) {
    this.i18n.setLang(lang);
  }
}
