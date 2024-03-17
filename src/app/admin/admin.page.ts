import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GestionEventosService } from '../gestion-eventos.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public eventos: Event[] = [];
  selectedEvent: Event | null = null;
  editEventForm: FormGroup;
  isEditModalOpen = false;

  constructor(public fb:FormBuilder, private router:Router, private gestionEventosService:GestionEventosService) {
    this.eventos = [];
    this.editEventForm = this.fb.group({
      'name': new FormControl("", Validators.required),
      'date': new FormControl("", Validators.required)
    })
  }

  ionViewDidEnter() {
    this.loadEvents();
  }

  openEditModal(isOpen: boolean, event:Event | null=null){
    this.selectedEvent = event;
    this.isEditModalOpen = isOpen;
  }

  loadEvents() {
    const storedEventos = this.gestionEventosService.read('eventos');
    const storedData = localStorage.getItem('eventos');
    const eventos:Event[] = JSON.parse(storedData || '[]');
    
    this.eventos = storedEventos;
  }

  addEvent(newEvent: Event) {
    this.eventos.push(newEvent);
    this.saveEvents();
  }

  updateEvent(){
    if (this.editEventForm.valid){
      const editedEvent = {
        name: this.editEventForm.value.name || this.selectedEvent?.name,
        date: this.editEventForm.value.date || this.selectedEvent?.date
      };
      const eventToUpdate = this.selectedEvent?.name;
      const index = this.eventos.findIndex(event => event.name === eventToUpdate);
      if (index !== null) {
        this.eventos[index] = editedEvent;
        this.saveEvents();
        this.editEventForm.reset();
        this.openEditModal(false);
      } else {
        console.error("Evento no encontrado.");
      }
    }
  }

  deleteEvent(index: number) {
    this.eventos.splice(index, 1);
    this.saveEvents();
  }

  saveEvents() {
    this.gestionEventosService.update('eventos', this.eventos);
  }

  ngOnInit() {
    this.loadEvents();
    this.editEventForm = this.fb.group({
      name: new FormControl(this.selectedEvent?.name),
      date: new FormControl(this.selectedEvent?.date)
    });
  }

  logOut(){
    localStorage.setItem('Ingresado', 'false');
    this.router.navigate(['/login']);
  }

}

interface Event {
  name: string;
  date: string;
}
