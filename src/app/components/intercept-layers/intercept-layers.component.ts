////// Importamos los componentes que requerimos.
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-intercept-layers',
  templateUrl: './intercept-layers.component.html',
  styleUrls: ['./intercept-layers.component.scss']
})
export class InterceptLayersComponent implements OnInit {
  /* 
    Variables locales 
  */
  /// Obtener listado de capas de mapa
  listLayers: any = [];
  selectedLayer1: string = "-1";
  selectedLayer2: string = "-1";
  disabledBtnInter: boolean = true;

  /// Constructor de la clase
  constructor(private service: MapService,
    public dialogRef: MatDialogRef<InterceptLayersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /// Cargue configuración inicial
  ngOnInit(): void {
    this.getListLayers();
  }

  /// Cerrar formulario Interceptar
  onNoClick(): void {
    this.dialogRef.close();
  }

  /// Obtener listado de capas de mapa
  getListLayers() {
    this.service.getListLayers();
    const listLayers = localStorage.getItem("listLayers");
    if (listLayers !== null) {
      let l = JSON.parse(listLayers);
      this.listLayers = l;
    }
  }

  /// Interceptar capas y graficos de mapa
  intercept() {
    if (this.selectedLayer1 && this.selectedLayer1 !== '-1') {
      this.service.intersect(this.selectedLayer1);
    } else {
      alert("Debe seleccionar una capa!.");
    }
  }

  /// Cerrar formulario Interceptar
  closeWin() {
    this.onNoClick();
  }

  /// Método evento: CHANGE, para validar evento click "Interceptar"
  selLayer1() {
    if (this.selectedLayer1 && this.selectedLayer1 !== '-1') {
      this.disabledBtnInter = false;
    } else {
      this.disabledBtnInter = true;
    }
  }

}
