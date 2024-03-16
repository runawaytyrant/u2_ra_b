import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionEventosService } from '../gestion-eventos.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formularioRegistro:FormGroup;
  public usuarios: { username: string, email: string, password:string }[] = [];

  constructor(public fb:FormBuilder, private router:Router, private gestionEventosService:GestionEventosService, private alertController:AlertController) {
    this.usuarios = [];
    this.formularioRegistro = this.fb.group({
      'username': new FormControl("", Validators.required),
      'email': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
    this.loadUsers();
  }

  async registrar(){

    const missingValuesAlert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: 'Favor de llenar todos los campos.',
      buttons: ['Aceptar'],
    });

    if(this.formularioRegistro.valid){
      const newUser = {
        username: this.formularioRegistro.value.username,
        email: this.formularioRegistro.value.email,
        password: this.formularioRegistro.value.password
      };

      this.usuarios.push(newUser);
      this.saveUsers();
      this.router.navigate(['/login']);
      console.log('Datos guardados');

      this.formularioRegistro.reset();
    } else {
      await missingValuesAlert.present();
    }
  }

  saveUsers() {
    this.gestionEventosService.update('usuarios', this.usuarios);
  }

  loadUsers() {
    const storedProductos = this.gestionEventosService.read('usuarios');
    this.usuarios = storedProductos;
  }
}
