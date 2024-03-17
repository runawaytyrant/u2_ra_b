import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionEventosService } from '../gestion-eventos.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})

export class AddEventPage implements OnInit {
  addEventForm:FormGroup;
  public eventos: { name: string, date: string }[] = [];

  constructor(public fb:FormBuilder, private router:Router, private gestionEventosService:GestionEventosService) {
    this.eventos = [];

    this.addEventForm = this.fb.group({
      'name': new FormControl("", Validators.required),
      'date': new FormControl("", Validators.required)
    })
  }

  addEvent(){
    if(this.addEventForm.valid){
      const newEvent = {
        name: this.addEventForm.value.name,
        date: this.addEventForm.value.date,
        participants: 0
      };

      this.eventos.push(newEvent);
      this.saveEvents();
      this.router.navigate(['/admin']);
      console.log('Datos guardados.');
      this.addEventForm.reset();
    }
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const storedEvents = this.gestionEventosService.read('eventos');
    
    this.eventos = storedEvents;
  }

  saveEvents() {
    this.gestionEventosService.update('eventos', this.eventos);
  }

}
