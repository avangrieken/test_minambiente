////// Importamos los componentes que requerimos.
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-add-shape-file',
  templateUrl: './add-shape-file.component.html',
  styleUrls: ['./add-shape-file.component.scss']
})
export class AddShapeFileComponent implements OnInit {
  /* 
  Variables locales 
  */
  public files: Set<File> = new Set();
  @ViewChild('file', { static: true }) private file: ElementRef;
  mensaje: string = "";

  /// Constructor de la clase
  constructor(private service: MapService,
    public dialogRef: MatDialogRef<AddShapeFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /// Cargue configuración inicial
  ngOnInit(): void {
  }

  /// Cerrar formulario
  onNoClick(): void {
    this.dialogRef.close();
  }

  /// Carga objeto ShapeFile, lo envio al servidor para procesar y esperar respuesta.
  loadShapeFile(): void {
    this.files = new Set();
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }

    let form = new FormData();

    this.files.forEach(file => {

      let name = file.name;

      var publishParams = {
        'name': name,
        'targetSR': {
          'wkid': '10200'
        },
        'maxRecordCount': 1000,
        'enforceInputFileSizeLimit': true,
        'enforceOutputJsonSizeLimit': true
      };

      form.append("publishParameters", JSON.stringify(publishParams));
      form.append("filetype", "shapefile");
      form.append("f", "json");

      //form.append("file", this.dataURItoBlob(file), zipName);
      form.append("file", file, name);
    });

    this.service.loadShapeFile(form).subscribe(
      response => {
        //console.log(response)
        if (response.error) {
          return;
        }

        const featureCollection = response.featureCollection;
        if (featureCollection.layers) {
          this.service.addShapeFile(featureCollection.layers);
        }
      },
      err => {
        console.log(err);
        this.mensaje = err.message;
      }
    );
  }

  private dataURItoBlob(dataURI: any) {
    var array = [];
    if (dataURI instanceof Array) {
      array = dataURI;
    }
    else {
      var binary = atob(dataURI);
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
    }
    return new Blob([new Uint8Array(array)], { type: 'application/zip' });
  }

  /// Cerrar formulario
  closeWin() {
    this.onNoClick();
  }

}
