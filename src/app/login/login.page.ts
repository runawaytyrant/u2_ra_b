import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin:FormGroup;

  constructor(public fb:FormBuilder, private router:Router, private alertcontroller:AlertController) {
    this.formularioLogin = this.fb.group({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  async inicio() {
    const wrongDataAlert = await this.alertcontroller.create({
      header: 'Wrong credentials',
      message: 'The username or password is incorrect.',
      buttons: ['Aceptar'],
    });

    var f = this.formularioLogin.value;
    var usuarioString = localStorage.getItem('usuarios');

    if(usuarioString !== null) {
      var usuarios:User[] = JSON.parse(usuarioString);
      var usuario = usuarios.find((user:User) => user.username === f.username && user.password === f.password);
      
      if(usuario) {
        localStorage.setItem('Ingresado', 'true');
        if(usuario.isadmin === 'true') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home', { username: usuario.username }]);
        }
      } else {
        console.log('Datos erróneos.');
        await wrongDataAlert.present();
      }
    } else {
      console.log('No se encuentra usuario.');
    }
  }
}

interface User {
  username: string;
  password: string;
  isadmin: string;
}
