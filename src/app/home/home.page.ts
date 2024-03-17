import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionEventosService } from '../gestion-eventos.service';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as QRCode from 'qrcode-generator';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  username: string | undefined;
  feedbackForm: FormGroup;
  isFeedbackModalOpen = false;
  qrCodeGenerated = false;
  public feedback: Feedback[] = [];
  public usuarios: User[] = [];
  public eventos: Event[] = [];

  constructor(private route:ActivatedRoute, private gestionEventosService:GestionEventosService, private router:Router, private alertController:AlertController, public fb:FormBuilder, public navCtrl:NavController) {
    this.feedback = [];
    this.feedbackForm = this.fb.group({
      'overallExperience': new FormControl("", Validators.required),
      'discoveryMethod': new FormControl("", Validators.required),
      'reasonForAttending': new FormControl("", Validators.required)
    })
  }

  recordFeedback(){
    if(this.feedbackForm.valid) {
      const newFeedback = {
        overallExperience: this.feedbackForm.value.overallExperience,
        discoveryMethod: this.feedbackForm.value.discoveryMethod,
        reasonForAttending: this.feedbackForm.value.reasonForAttending
      };

      this.feedback.push(newFeedback);
      this.saveFeedback();
      this.feedbackForm.reset();
      this.openFeedbackModal(false);
      console.log('Encuesta guardada.');
    }
  }

  openFeedbackModal(isOpen: boolean) {
    this.isFeedbackModalOpen = isOpen;
  }

  loadEvents() {
    const storedEventos = this.gestionEventosService.read('eventos');
    const storedData = localStorage.getItem('eventos');
    const eventos:Event[] = JSON.parse(storedData || '[]');
    
    this.eventos = storedEventos;
    this.eventos.forEach(event => {
      event.participating = false;
    });
  }

  ngOnInit(){
    this.loadEvents();
    this.username = this.route.snapshot.paramMap.get('username') ?? undefined;
    /*
    const isLoggedIn = localStorage.getItem('Ingresado') === 'true';
    if (isLoggedIn) {
      const usuarioString = localStorage.getItem('usuarios');
      if (usuarioString !== null) {
        const usuarios = JSON.parse(usuarioString);
        this.username = usuarios[0].username;
      }
    }
    */
  }

  logOut(){
    localStorage.setItem('Ingresado', 'false');
    this.router.navigate(['/login']);
  }

  deleteUser(index: number) {
    this.usuarios.splice(index, 1);
    this.saveUsers();
  }

  saveUsers() {
    this.gestionEventosService.update('usuarios', this.usuarios);
  }

  saveFeedback(){
    this.gestionEventosService.update('feedback', this.feedback);
  }

  async addParticipant(index:number) {
    const eventToUpdate = this.eventos[index];
    const participatingAlert = await this.alertController.create({
      header: 'Subscribed',
      message: 'You are now participating in this event.',
      buttons: ['Ok'],
    });

    if(!eventToUpdate.participating) {
      eventToUpdate.participating = true;
      eventToUpdate.participants++;
      this.eventos[index] = eventToUpdate;
      this.gestionEventosService.update('eventos', this.eventos);
      await participatingAlert.present();
    }
  }

  async deleteParticipant(index:number) {
    const eventToUpdate = this.eventos[index];
    const participatingAlert = await this.alertController.create({
      header: 'Unsubscribed',
      message: 'You are no longer participating in this event.',
      buttons: ['Ok'],
    });

    if(eventToUpdate.participating) {
      eventToUpdate.participating = false;
      eventToUpdate.participants--;
      this.eventos[index] = eventToUpdate;
      this.gestionEventosService.update('eventos', this.eventos);
      await participatingAlert.present();
    }
  }

  generateQRCode(username: string) {
    const qr = QRCode(0, 'M');
    qr.addData(username);
    qr.make();

    const svg = qr.createSvgTag(8,8);
    const qrcodeElement = document.getElementById('qrcode');
    if (qrcodeElement) {
      qrcodeElement.innerHTML = svg;
    }
  }

  onClickGenerateQRCode(username: string | undefined) {
    if (username) {
      this.generateQRCode(username);
      this.qrCodeGenerated = true;
    }
  }
}

interface User {
  username: string;
  password: string;
}

interface Event {
  name: string;
  date: string;
  participants: number;
  participating: boolean;
}

interface Feedback {
  overallExperience: string;
  discoveryMethod: string;
  reasonForAttending: string;
}