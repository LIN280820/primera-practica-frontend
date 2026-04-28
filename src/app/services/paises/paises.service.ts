import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from '../../models/pais';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private apiURL = 'http://localhost:8080/paises';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pais[]>
  {
    return this.http.get<Pais[]>(this.apiURL);
  }

  guardar(pais: Pais): Observable<Pais>
  {
    return this.http.post<Pais>(this.apiURL, pais);
  }

  actualizar(id: number, pais: Pais): Observable<Pais>
  {
    return this.http.put<Pais>(`${this.apiURL}/${id}`, pais);
  }

  eliminar(id: number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

}