import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
})
export class SharedModule {}
