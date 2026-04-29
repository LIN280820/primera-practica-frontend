import { Component, OnInit } from '@angular/core';
import { Persona } from '../../models/persona';
import { Provincia } from '../../models/provincia';
import { Pais } from '../../models/pais';
import { PersonasService } from '../../services/personas/personas.service';
import { ProvinciasService } from '../../services/provincias/provincias.service';
import { PaisesService } from '../../services/paises/paises.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-personas',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule],
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.css',
})
export class PersonasComponent implements OnInit {
  personas: Persona[] = [];
  provincias: Provincia[] = [];
  paises: Pais[] = [];
  personaForm!: FormGroup;
  editando = false;
  idEditando?: number;

  constructor(private personasService: PersonasService, private provinciasService: ProvinciasService,
    private paisesService: PaisesService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    //Construir los formularion
    this.personaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      provinciaId: ['', Validators.required],
      paisId: ['', Validators.required]
    });

    //Carga los datos
    this.listarPaises();
    this.listarPersonas();
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000
    });
  }

  limpiarFormulario() {
    this.personaForm.reset();
    this.editando = false;
    this.idEditando = undefined;
    this.provincias = [];
    this.listarPersonas();
  }

  editar(persona: Persona) {
    this.editando = true;
    this.idEditando = persona.id;

    this.personaForm.patchValue({
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      paisId: persona.pais?.id
    });

    this.provinciasService.listarPorPais(Number(persona.pais?.id)).subscribe({
      next: (data) => {
        this.provincias = data;

        this.personaForm.patchValue({
          provinciaId: persona.provincia?.id
        });
      }
    });
  }

  listarPersonas() {
    this.personasService.listar().subscribe({ next: (data) => { this.personas = data } });
  }

  listarPaises() {
    this.paisesService.listar().subscribe({ next: (data) => { this.paises = data } });
  }

  listarProvinciasPorPais() {
    const paisId = this.personaForm.value.paisId;
    if (!paisId) {
      this.provincias = [];
      this.personaForm.patchValue({ provinciaId: '' });
      return;
    }
    this.provinciasService.listarPorPais(Number(paisId)).subscribe({
      next: (data) => {
        this.provincias = data;
        this.personaForm.patchValue({ provinciaId: '' });
      }
    });
  }

  guardar() {
    if (this.personaForm.invalid) {
      return;
    }
    const persona: Persona = {
      nombre: this.personaForm.value.nombre,
      apellido: this.personaForm.value.apellido,
      edad: Number(this.personaForm.value.edad),
      provincia: {
        id: Number(this.personaForm.value.provinciaId)
      },
      pais: {
        id: Number(this.personaForm.value.paisId)
      }
    };

    if (this.editando && this.idEditando) {
      this.personasService.actualizar(this.idEditando, persona).subscribe({
        next: () => {
          this.mostrarMensaje('Persona actualizada correctamente');
          this.limpiarFormulario();
        }
      });
    }
    else {
      this.personasService.guardar(persona).subscribe({
        next: () => {
          this.mostrarMensaje('Persona registrada correctamente');
          this.limpiarFormulario();
        }
      });
    }
  }

  eliminar(id: number) {
    const dialogo = this.dialog.open(ConfirmDialogComponent);

    dialogo.afterClosed().subscribe({
      next: (confirmado) => {
        if (confirmado) {
          this.personasService.eliminar(id).subscribe({ next: () => { this.listarPersonas(); } });
        }
      }
    });
  }
}
