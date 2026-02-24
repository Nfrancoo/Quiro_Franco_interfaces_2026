import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme';
import { 
  IonApp, 
  IonRouterOutlet,
  IonFab,
  IonFabButton,
  IonFabList,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:true,
  imports: [IonApp, IonRouterOutlet, CommonModule,FormsModule, 
    IonFab, IonFabButton, IonFabList, IonModal, IonHeader, IonToolbar, 
    IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, 
    IonLabel, IonSelect, IonSelectOption, IonRange,IonInput],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  modoOscuro = false;

  temaActual: string = 'profesional';
  temaClaseActual: string = 'tema-profesional';
  textoSubtitulo: string = 'Personalización Total';

  iconoBoton: string = ''; 
  

  customFondo: string = '#000000';
  customBtn: string = '#3dc2ff';
  customTexto: string = '#ffffff';
  customFuente: string = 'Impact, sans-serif'; 
  customRango: number = 20;
  customFormaBoton:string = "0px"
  customAnchoCard: number = 350;
  
  logoActual: string = 'assets/iconos/logo_pro.png';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
  const temaGuardado = localStorage.getItem('tema-seleccionado') || 'profesional';
  this.cambiarTema(temaGuardado);

  if (temaGuardado === 'custom') {
    const textoGuardado = localStorage.getItem('subtitulo-custom');
    if (textoGuardado) {
      this.textoSubtitulo = textoGuardado;
    }
  }
}

cambiarTema(tema: string) {
  this.temaActual = tema;
  this.temaClaseActual = `tema-${tema}`;
  this.themeService.setTheme(tema);
  this.actualizarLogo(tema);
  

  if (tema === 'argentina') {
    this.textoSubtitulo = 'Campeones del Mundo';
  } else if (tema === 'naif') {
    this.textoSubtitulo = 'Todo es color de rosa';
  } else if (tema === 'profesional') {
    this.textoSubtitulo = 'Personalización Total';
  }


  this.reproducirSonido(tema);
}

  reproducirSonido(tema: string) {
    let audio = new Audio();
    
    if (tema === 'argentina') audio.src = 'assets/sonidos/click.mp3';
    else if (tema === 'naif') audio.src = 'assets/sonidos/campana.mp3';
    else audio.src = 'assets/sonidos/burbuja.mp3'; 

    audio.load();
    audio.play().catch(e => console.log("Error de audio:", e));
  }

  actualizarLogo(tema: string) {
  if (tema === 'argentina') {
    this.logoActual = 'assets/iconos/argentina-removebg-preview.png';
    this.iconoBoton = 'assets/iconos/sol.png';
  } else if (tema === 'naif') {
    this.logoActual = 'assets/iconos/naif-removebg-preview.png';
    this.iconoBoton = 'assets/iconos/flor.png';
  } else if(tema === 'profesional') {

    this.logoActual = 'assets/iconos/logo_pro.png';
    this.iconoBoton = 'assets/iconos/profesional.png'; 
  } else if(tema === 'Custom'){
    this.logoActual = 'assets/iconos/pincel.png';
    this.iconoBoton = ''; 
  }
}

  toggleOscuro() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) document.body.classList.add('modo-oscuro');
    else document.body.classList.remove('modo-oscuro');
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  aplicarCustom() {
  this.temaActual = 'custom';
  this.temaClaseActual = 'tema-custom';


  this.themeService.setCustomTheme(
    this.customFondo, 
    this.customBtn, 
    this.customTexto,
    this.customFuente, 
    this.customRango, 
    this.customFormaBoton,
    this.textoSubtitulo 
  );

  this.actualizarLogo('Custom');
  this.setOpen(false);
}
}