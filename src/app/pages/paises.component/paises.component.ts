import { Component, OnInit } from '@angular/core';
import { PaisesService } from '../../services/paises/paises.service';
import { Pais } from '../../models/pais';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-paises',
  imports: [CommonModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.css',
})
export class PaisesComponent implements OnInit {

  paises: Pais[] = [];
  paisForm!: FormGroup;
  editando = false;
  idEditando?: number;

  constructor(private paisesService: PaisesService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.paisForm = this.fb.group({ nombre: ['', Validators.required] });
    this.listarPaises();
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000
    });
  }

  editar(pais: Pais) {
    this.editando = true;
    this.idEditando = pais.id;
    this.paisForm.patchValue({
      nombre: pais.nombre
    });
  }

  limpiarFormulario() {
    this.paisForm.reset();
    this.editando = false;
    this.idEditando = undefined;
    this.listarPaises();
  }

  listarPaises() {
    this.paisesService.listar().subscribe({ next: (data) => { this.paises = data; } });
  }

  guardar() {
    if (this.paisForm.invalid) {
      return;
    }
    const pais: Pais = {
      nombre: this.paisForm.value.nombre
    };

    if (this.editando && this.idEditando) {
      this.paisesService.actualizar(this.idEditando, pais).subscribe({
        next: () => {
          this.mostrarMensaje('País actualizado correctamente');
          this.limpiarFormulario();
        }
      });
    }
    else {
      this.paisesService.guardar(pais).subscribe({
        next: () => {
          this.mostrarMensaje('País registrado correctamente');
          this.limpiarFormulario()
        }
      });
    }
  }

  eliminar(id: number) {
    const dialogo = this.dialog.open(ConfirmDialogComponent);
    dialogo.afterClosed().subscribe({
      next: (confirmado) => {
        if (confirmado) {
          this.paisesService.eliminar(id).subscribe({ next: () => { this.listarPaises(); } });
        }
      }
    });
  }
}