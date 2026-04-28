import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaisesComponent } from './pages/paises.component/paises.component';
import { ProvinciasComponent } from './pages/provincias.component/provincias.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PaisesComponent, ProvinciasComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('primera-practica');
}
