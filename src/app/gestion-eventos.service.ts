import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GestionEventosService {

  constructor() { }

  create(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  read(key: string): any {
    const dataString = localStorage.getItem(key);
    if (dataString !== null) {
      return dataString ? JSON.parse(dataString) : null;
    }
  }

  update(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }

}
