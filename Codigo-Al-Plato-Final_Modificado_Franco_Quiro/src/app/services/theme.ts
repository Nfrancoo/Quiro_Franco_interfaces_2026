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
    this.limpiarClases(); // Borramos clases viejas
    this.limpiarCustomStyles(); // Borramos estilos inline viejos

    if (nombreTema !== 'profesional') {
      document.body.classList.add(`tema-${nombreTema}`);
    }

    this.temaActualSubject.next(nombreTema);
    localStorage.setItem('tema-seleccionado', nombreTema);
  }


  setCustomTheme(colorFondo: string, colorBtn: string, colorTexto: string, fuente: string, tamanoLetra: number, customFormaBoton:string) {
    this.limpiarClases(); 
    document.body.classList.add('tema-custom');

    const root = document.documentElement.style;
    
    // 👇 AGREGÁ ESTA LÍNEA PARA EL FONDO DEL HOME 👇
    root.setProperty('--fondo-body', colorFondo); 
    
    // (Mantené el resto de las variables que ya tenías)
    root.setProperty('--bg-grad-1', colorFondo); 
    root.setProperty('--bg-grad-2', colorFondo); 
    root.setProperty('--btn-bg', colorBtn);
    root.setProperty('--texto-general', colorTexto);
    root.setProperty('--btn-texto', colorTexto);
    root.setProperty('--fuente-principal', fuente);
    root.setProperty('--tamano-fuente', `${tamanoLetra}px`);
    root.setProperty('--btn-radio', customFormaBoton);
    
    this.temaActualSubject.next('custom');
    localStorage.setItem('tema-seleccionado', 'custom');
    
    const customConfig = { colorFondo, colorBtn, colorTexto, fuente, tamanoLetra, customFormaBoton };
    localStorage.setItem('tema-custom-config', JSON.stringify(customConfig));
  }

  private limpiarClases() {
    const clases = ['tema-argentina', 'tema-profesional', 'tema-naif', 'tema-custom'];
    document.body.classList.remove(...clases);
  }

  private limpiarCustomStyles() {
    const root = document.documentElement.style;
    root.removeProperty('--fondo-body');
    root.removeProperty('--bg-grad-1');
    root.removeProperty('--bg-grad-2');
    root.removeProperty('--btn-bg');
    root.removeProperty('--texto-general');
    root.removeProperty('--btn-texto');
    root.removeProperty('--fuente-principal');
    root.removeProperty('--tamano-fuente');
    root.removeProperty('--btn-radio');
  }
}