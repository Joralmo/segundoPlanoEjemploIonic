import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MenuController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Component } from '@angular/core';
import { AlertController, NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  datos: FirebaseListObservable<any>;
  nombre:string;
  estado:string;
  constructor(public fireDatabase: AngularFireDatabase,public menuCtrl:MenuController, public alerta:AlertController,public navCtrl: NavController,public backgroundMode: BackgroundMode, public platform:Platform) {
    this.datos = this.fireDatabase.list('/datos');
    this.go();
    this.nombre="Nombre";
    this.estado="La aplicación no se ejecuta en segundo plano";
  }

  nuevoDato(){
    let nuevoDato = this.alerta.create({
      title: 'Nuevo Dato',
      message: "Titulo del nuevo dato",
      inputs: [
        {
          name: 'titulo',
          placeholder: 'Titulo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar clickeado');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.datos.push({
              title: data.titulo,
              done: false
            });
          }
        }
      ]
    });
    nuevoDato.present();
  }

  actualizarDato(dato){
    this.datos.update( dato.$key,{
      title: dato.title,
      done: !dato.done
    });
  }

  eliminarDato(dato){
    this.datos.remove(dato.$key);
  }

  go(){
    if(this.platform.is('cordova')){
      setInterval(data =>{
        this.reAbrir();
      }, 5000);
    }
  }

  segundoPlano(){
    let alerta = this.alerta.create({
      title:'¡HEY!',
      subTitle:'la aplicacion seguira ejecutando tareas en segundo plano',
      buttons:[{
        text:'Cancelar',
        handler: ()=>{
          let alerta = this.alerta.create({
            title:'Cancelado',
            subTitle:'Ejecucion en segundo plano cancelada',
            buttons:['Ok']
          });
          alerta.present();
        }
      },
      {
        text:'De acuerdo',
        handler: () => {
          this.backgroundMode.setDefaults({ 
            title: 'Mi aplicación', 
            text: 'Aplicación corriendo en segundo plano',
            icon:'icon',
            resume:true,
            color:'CCCCCC'
          });
          this.backgroundMode.enable();
          this.estado="La aplicación se esta ejecutando en segundo plano";
          this.backgroundMode.moveToBackground();
        },
      }]
    });
    alerta.present();
  }


  reAbrir(){
    if(this.backgroundMode.isEnabled()){
      console.log("aplicacion en segundo plano");
    }else{
      console.log("esperando background");
    }
  }

  detenerSegundoPlano(){
    if(this.backgroundMode.isEnabled()){
      this.backgroundMode.disable();
      this.estado="La aplicación no se ejecuta en segundo plano";
      let alerta = this.alerta.create({
        title:'¡Exito!',
        subTitle:'Ejecucion en segundo plano detenida',
        buttons:['Ok']
      });
      alerta.present();
    }else{
      let alerta = this.alerta.create({
        title:'Espera!',
        subTitle:'La aplicación no se esta ejecutando en segundo plano, primero ejecutala para poder detenerla',
        buttons:['Ok']
      });
      alerta.present();
    }
    
  }

  abrirMenu(){
    this.menuCtrl.open();
  }
  cerrarMenu(){
    this.menuCtrl.close();
  }
}
