import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private temaActualSubject = new BehaviorSubject<string>('profesional');
  public temaActual$ = this.temaActualSubject.asObservable();

  constructor() {
    const temaGuardado = localStorage.getItem('tema-seleccionado') || 'profesional';
    this.setTheme(temaGuardado);
  }

  setTheme(nombreTema: string) {
    this.limpiarClases(); 
    this.limpiarCustomStyles(); 

    if (nombreTema !== 'profesional') {
      document.body.classList.add(`tema-${nombreTema}`);
    }

    this.temaActualSubject.next(nombreTema);
    localStorage.setItem('tema-seleccionado', nombreTema);
  }


public subtituloPersistente: string = 'Personalización Total';

  setCustomTheme(colorFondo: string, colorBtn: string, colorTexto: string, fuente: string, tamanoLetra: number, customFormaBoton: string, textoSubtitulo: string) {
      this.limpiarClases(); 
      document.body.classList.add('tema-custom');

      const root = document.documentElement.style;
      root.setProperty('--fondo-app', colorFondo); 
      root.setProperty('--btn-bg', colorBtn);
      root.setProperty('--texto-color', colorTexto);
      root.setProperty('--fuente-principal', fuente);
      root.setProperty('--tamano-fuente', `${tamanoLetra}px`);
      root.setProperty('--btn-radio', customFormaBoton);
      

      this.subtituloPersistente = textoSubtitulo;
      
      this.temaActualSubject.next('custom');
  }

  private limpiarClases() {
    const clases = ['tema-argentina', 'tema-profesional', 'tema-naif', 'tema-custom'];
    document.body.classList.remove(...clases);
  }

  private limpiarCustomStyles() {
    const root = document.documentElement.style;
    root.removeProperty('--fondo-app');
    root.removeProperty('--btn-bg');
    root.removeProperty('--texto-color');
    root.removeProperty('--fuente-principal');
    root.removeProperty('--tamano-fuente');
    root.removeProperty('--btn-radio');
  }
}