import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {

  URL: string = "";

  constructor(
    private service: MapService,
    public dialogRef: MatDialogRef<AddServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  /// Metodo para cerrar el formulario
  onNoClick(): void {
    this.dialogRef.close();
  }

  /// Cargar servicio ingresado
  loadService(): void {
    if (this.URL && this.validURL(this.URL)) {
      this.service.loadService({
        url: this.URL
      });
    } else {
      alert("Error: URL no válida!");
    }
  }

  /// Cerrar formulario
  closeWin() {
    this.onNoClick();
  }

  /// Validar URL ingresada por medio de expresion regular
  validURL(evt: any) {
    var res = evt.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  }

}
