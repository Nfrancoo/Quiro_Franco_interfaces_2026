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
  imports: [IonApp, IonRouterOutlet, SplashscreenComponent, CommonModule, InfoPedidoComponent,FormsModule, // Mantenemos FormsModule para que funcione el [(ngModel)]
    // 👇 Agregamos solo los componentes que usamos 👇
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
  customFuente: string = "'Raleway', sans-serif"; // Tu fuente por defecto
  customRango: number = 18;
  customFormaBoton: string = "26px"; // El borde redondeado que usás por defecto

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
      
      // 1. LOG DE DEPURACIÓN: Mira la consola al tocar la notificación
      console.log('🔔 Notificación tocada. Datos extra:', extra);

      if (!extra) return;

      this.ngZone.run(() => {
        // Acciones Específicas
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
          this.router.navigateByUrl('/delivery'); // Usamos navigateByUrl que a veces fuerza mejor la ruta
        }
        
        // 2. FALLBACK (PLAN B):
        // Si no entró en ningún if anterior, pero tiene una ruta (targetPage), ir ahí.
        // Esto arregla el problema si olvidaste poner el "action" al enviar la push.
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
    e.preventDefault(); // ⛔ bloquea scroll libre del navegador

    if (bloqueado) return;
    bloqueado = true;

    const direccion = Math.sign(e.deltaY); // 1 baja, -1 sube
    const altura = container.clientHeight;

    container.scrollBy({
      top: direccion * altura,
      behavior: 'smooth'
    });

    setTimeout(() => {
      bloqueado = false;
    }, 650); // tiempo del snap
  }, { passive: false });
}

cambiarTema(tema: string) {
    // 👇 1. APAGAMOS EL MODO OSCURO AUTOMÁTICAMENTE 👇
    this.modoOscuro = false;
    document.body.classList.remove('modo-oscuro');

    // 2. Aplicamos el nuevo tema
    this.themeService.setTheme(tema);
    this.reproducirSonido(tema); 
  }

  aplicarCustom() {
    // 👇 1. APAGAMOS EL MODO OSCURO ACÁ TAMBIÉN 👇
    this.modoOscuro = false;
    document.body.classList.remove('modo-oscuro');

    // 2. Aplicamos el tema custom
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
      // 👇 Llamamos al sonido de noche al encenderlo 👇
      this.reproducirSonido('modo-oscuro'); 
    } else {
      document.body.classList.remove('modo-oscuro');
      // 👇 Llamamos a 'default' para que caiga en el else y suene la burbuja al apagarlo 👇
      this.reproducirSonido('default'); 
    }
  } 

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

}