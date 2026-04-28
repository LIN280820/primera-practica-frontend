import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from '../../models/provincia';

@Injectable({
  providedIn: 'root',
})
export class ProvinciasService {
  private apiUrl = 'http://localhost:8080/provincias';
  
  constructor(private http: HttpClient) { }

  listar(): Observable<Provincia[]>
  {
    return this.http.get<Provincia[]>(this.apiUrl);
  }

  guardar(provincia: Provincia): Observable<Provincia>
  {
    return this.http.post<Provincia>(this.apiUrl, provincia);
  }

  actualizar(id: number, provincia: Provincia): Observable<Provincia>
  {
    return this.http.put<Provincia>(`${this.apiUrl}/${id}`, provincia);
  }

  eliminar(id: number): Observable<void>
  {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}