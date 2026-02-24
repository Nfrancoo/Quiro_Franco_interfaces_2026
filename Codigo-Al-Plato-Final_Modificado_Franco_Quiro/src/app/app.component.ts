import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { pushService } from './services/serviciosPush/push-notifications.service';
import { DatabaseService } from './services/database.service';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { SplashscreenComponent } from './components/components.component';
import { CommonModule } from '@angular/common'; 
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { InfoPedidoComponent } from './components/info-pedido/info-pedido.component';
import { PedidoService } from './services/pedido.service';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from './services/theme';
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
  IonRange
} from '@ionic/angular/standalone';

GoogleAuth.initialize();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SplashscreenComponent, CommonModule, InfoPedidoComponent,FormsModule,
    IonFab, IonFabButton, IonFabList, IonModal, IonHeader, IonToolbar, 
    IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, 
    IonLabel, IonSelect, IonSelectOption, IonRange],
})
export class AppComponent implements OnInit, OnDestroy {
  
  showSplash = true;
  mostrarBotonInfo: boolean = false; 
  
  private subs: Subscription = new Subscription();

  isModalOpen = false;
  modoOscuro = false;
  customFondo: string = '#000000';
  customBtn: string = '#00b4d8';
  customTexto: string = '#ffffff';
  customFuente: string = "'Raleway', sans-serif"; 
  customRango: number = 18;
  customFormaBoton: string = "26px"; 

  constructor(
    private platform: Platform,
    protected db: DatabaseService,
    protected auth: AuthService,
    protected pushService: pushService,
    protected router: Router,
    public pedidoService: PedidoService, 
    private ngZone: NgZone,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    
    this.subs.add(
      this.pedidoService.escucharPedidoCliente() 
    );

    this.subs.add(
      this.pedidoService.mostrarInfo$.subscribe((mostrar) => {
        this.mostrarBotonInfo = mostrar;
      })
    );

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      const extra = notification.notification.extra;
      
      console.log('🔔 Notificación tocada. Datos extra:', extra);

      if (!extra) return;

      this.ngZone.run(() => {

        if (extra.action === 'abrirPdf') {
          window.open(extra.targetPage, '_system');
        } 
        else if (extra.action === 'abrirChat') {
          this.router.navigate(['/chat']);
        } 
        else if (extra.action === 'abrirChatDelivery') {
          this.router.navigate(['/chat-delivery']);
        } 
        else if (extra.action === 'abrirListado') {
          this.router.navigate(['/listado-productos']);
        }
        else if (extra.action === 'abrirDelivery') {
          console.log('Redirigiendo a Delivery por acción...');
          this.router.navigateByUrl('/delivery');
        }
        

        else if (extra.targetPage && typeof extra.targetPage === 'string' && extra.targetPage.startsWith('/')) {
             console.log('Acción no encontrada, usando targetPage:', extra.targetPage);
             this.router.navigateByUrl(extra.targetPage);
        }
      });
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSplashFinished() {
    this.showSplash = false;
  }

  ngAfterViewInit() {
  const container = document.getElementById('snapContainer');

  if (!container) return;

  let bloqueado = false;

  container.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();

    if (bloqueado) return;
    bloqueado = true;

    const direccion = Math.sign(e.deltaY); 
    const altura = container.clientHeight;

    container.scrollBy({
      top: direccion * altura,
      behavior: 'smooth'
    });

    setTimeout(() => {
      bloqueado = false;
    }, 650); 
  }, { passive: false });
}

cambiarTema(tema: string) {
    this.modoOscuro = false;
    document.body.classList.remove('modo-oscuro');


    this.themeService.setTheme(tema);
    this.reproducirSonido(tema); 
  }

  aplicarCustom() {
    this.modoOscuro = false;
    document.body.classList.remove('modo-oscuro');


    this.themeService.setCustomTheme(
      this.customFondo, 
      this.customBtn, 
      this.customTexto,
      this.customFuente,
      this.customRango,
      this.customFormaBoton
    );
    this.setOpen(false);
  }

  reproducirSonido(tema: string) {
    let audio = new Audio();
    if (tema === 'argentina') audio.src = 'assets/sonidos/click.mp3';
    else if (tema === 'naif') audio.src = 'assets/sonidos/campana.mp3';
    else if(tema === 'modo-oscuro') audio.src = 'assets/sonidos/Noche.mp3'
    else audio.src = 'assets/sonidos/burbuja.mp3'; 

    audio.load();
    audio.play().catch(e => console.log("Error de audio:", e));
  }

  toggleOscuro() {
    this.modoOscuro = !this.modoOscuro;
    
    if (this.modoOscuro) {
      document.body.classList.add('modo-oscuro');
      this.reproducirSonido('modo-oscuro'); 
    } else {
      document.body.classList.remove('modo-oscuro');
      this.reproducirSonido('default'); 
    }
  } 

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

}