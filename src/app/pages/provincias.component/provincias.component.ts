import { Component, OnInit } from '@angular/core';
import { Pais } from '../../models/pais';
import { Provincia } from '../../models/provincia';
import { PaisesService } from '../../services/paises/paises.service';
import { ProvinciasService } from '../../services/provincias/provincias.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-provincias',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule],
  templateUrl: './provincias.component.html',
  styleUrl: './provincias.component.css',
})
export class ProvinciasComponent implements OnInit {
  provincias: Provincia[] = [];
  paises: Pais[] = [];
  provinciaForm!: FormGroup;
  editando = false;
  idEditando?: number;

  constructor(private paisService: PaisesService, private provinciasService: ProvinciasService, private fb: FormBuilder) { }

  ngOnInit(): void {
    //Construir los formularion
    this.provinciaForm = this.fb.group({
      nombre: ['', Validators.required],
      paisId: ['', Validators.required]
    });

    //Carga los datos
    this.listarProvincias();
    this.listarPaises();
  }

  editar(provincia: Provincia) {
    this.editando = true;
    this.idEditando = provincia.id;

    this.provinciaForm.patchValue({
      nombre: provincia.nombre,
      paisId: provincia.pais?.id
    });
  }

  limpiarFormulario() {
    this.provinciaForm.reset();
    this.editando = false;
    this.idEditando = undefined;
    this.listarProvincias();
  }

  //Obtener provincias
  listarProvincias() {
    this.provinciasService.listar().subscribe({ next: (data) => { this.provincias = data } });
  }

  //Obtener paises
  listarPaises() {
    this.paisService.listar().subscribe({ next: (data) => { this.paises = data } });
  }

  //Guardar provincia
  guardar() {
    if (this.provinciaForm.invalid) {
      return;
    }
    const provincia: Provincia = {
      nombre: this.provinciaForm.value.nombre,
      pais: {
        id: Number(this.provinciaForm.value.paisId)
      }
    };

    if (this.editando && this.idEditando) {
      this.provinciasService.actualizar(this.idEditando, provincia).subscribe({
        next: () => {
          this.limpiarFormulario();
        }
      });
    }
    else {
      this.provinciasService.guardar(provincia).subscribe({
        next: () => {
          this.limpiarFormulario();
        }
      });
    }
  }

  //Eliminar provincia
  eliminar(id: number) {
    this.provinciasService.eliminar(id).subscribe({ next: () => { this.listarProvincias() } });
  }
}