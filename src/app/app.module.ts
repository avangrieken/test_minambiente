import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EsriMapComponent } from "./esri-map/esri-map.component";
import { MaterialModule } from "./material/material.module";
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddServicesComponent } from './components/add-services/add-services.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { AddShapeFileComponent } from './components/add-shape-file/add-shape-file.component';
import { HttpClientModule } from '@angular/common/http';
import { InterceptLayersComponent } from './components/intercept-layers/intercept-layers.component';

@NgModule({
  declarations: [AppComponent, EsriMapComponent, AddServicesComponent, AddShapeFileComponent, InterceptLayersComponent],
  imports: [
    BrowserModule, 
    MaterialModule, 
    MatListModule, 
    MatIconModule, 
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
