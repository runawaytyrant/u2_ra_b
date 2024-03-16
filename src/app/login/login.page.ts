import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin:FormGroup;

  constructor(public fb:FormBuilder, private router:Router) {
    this.formularioLogin = this.fb.group({
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    })
  }

  ngOnInit() {
  }

  async inicio() {
    var f = this.formularioLogin.value;
    var usuarioString = localStorage.getItem('usuarios');

    if(usuarioString !== null) {
      var usuario = JSON.parse(usuarioString);
      if(usuario.username == f.username && usuario.password == f.password){
        localStorage.setItem('Ingresado', 'true');
        this.router.navigate(['/home']);
      } else {
        console.log('Datos erróneos');
      }
    } else {
      console.log('No se encuentra usuario');
    }
  }

}
