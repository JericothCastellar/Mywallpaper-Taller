import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  /**

   * @param message 
   */
  async show(message: string = 'Cargando...') {
    if (this.loading) {
      await this.hide();
    }

    this.loading = await this.loadingController.create({
      message,
      spinner: 'crescent', 
      translucent: true,
      cssClass: 'custom-loading'
    });

    await this.loading.present();
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
