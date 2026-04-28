import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../../models/persona';

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private apiUrl = 'http://localhost:8080/personas';

  constructor(private http: HttpClient) { }

  listar(): Observable<Persona[]>
  {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  guardar(persona: Persona): Observable<Persona>
  {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  actualizar(id: number, persona: Persona): Observable<Persona>
  {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona);
  }

  eliminar(id: number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}