////// Importamos los componentes que requerimos.
import { Component } from '@angular/core';
import { MapService } from './services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { AddServicesComponent } from "./components/add-services/add-services.component";
import { AddShapeFileComponent } from "./components/add-shape-file/add-shape-file.component";
import { InterceptLayersComponent } from "./components/intercept-layers/intercept-layers.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  /* 
    Variables locales 
  */

  // Setear Propiedades del mapa
  mapCenter = [-74.1194, 6.7749];
  basemapType = 'hybrid';
  mapZoomLevel = 6;

  navItems = [
    {
      title: "Agregar Servicio",
      event: this.loadService,
      matIconName: "add",
      _self: this
    },
    {
      title: "Agregar SHAPE",
      event: this.loadShapeFile,
      matIconName: "map",
      _self: this
    },
    {
      title: "Interceptar capas",
      event: this.interceptLayers,
      matIconName: "satellite",
      _self: this
    }
  ];

  //// Capa Esri
  listLayersEsri = [
    {
      url: 'http://sigserv02.anla.gov.co:6080/arcgis/rest/services/ANLA_EXTERNO/MapServer/16',
      name: 'Áreas Licenciadas Hidrocarburos'
    },
    {
      url: 'http://mapas.parquesnacionales.gov.co/arcgis/rest/services/pnn/runap/FeatureServer',
      name: 'Runap'
    },
    {
      url: 'https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/arcgis/rest/services/Zonificaci%C3%B3n_Ambiental_POMCA_Rio_Garagoa_y_Macheta/FeatureServer/0',
      name: 'POMCA_Rio_Garagoa_y_Macheta'
    }
  ];

  //// Capa GeoJSON
  listLayersGeoJSON = [
    'https://opendata.arcgis.com/datasets/15f2dbc999404c1ebc8fc5537b70927f_0.geojson'
  ];

  //// Capa WMS
  //// Param: ?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetCapabilities
  listLayersWMS = [
    {
      url: 'http://mapas.parquesnacionales.gov.co/services/pnn/wms?',
      name: 'departamentos',
      version: '1.1.0'
    }
  ];

  //// Capa WFS
  //// Param: ?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetCapabilities
  listLayersWFS = [
    {
      url: 'http://sigserv02.anla.gov.co:6080/arcgis/services/Politico_administrativo2/MapServer/WFSServer',
      name: 'Limite_Corporaciones',
      version: '1.1.0'
    }
  ];

  /// Constructor de la clase
  constructor(private service: MapService,
    public dialog: MatDialog) { }

  // Evento se ejecuar cuando carga el mapa.
  mapLoadedEvent(status: boolean) {
    console.log('Mapa cargado: ', status);
  }

  /// Abrir formulario de carga de servicio Esri
  loadService(dat: any) {
    const _self = dat._self;
    _self.openDialogAddServices();
  }

  /// Inicio formulario para agregar servicios Esri
  openDialogAddServices(): void {
    const dialogRef = this.dialog.open(AddServicesComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /// Abrir formulario de carga de shapeFile
  loadShapeFile(dat: any) {
    const _self = dat._self;
    _self.openDialogAddShape();
  }

  /// Inicio formulario para agregar ShapeFile
  openDialogAddShape(): void {
    const dialogRef = this.dialog.open(AddShapeFileComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /// Abrir formulario de Interceptar capas
  interceptLayers(dat: any) {
    const _self = dat._self;
    _self.openDialogInterceptLayers();
  }

  /// Inicio formulario para agregar Formulario de Intersección
  openDialogInterceptLayers(): void {
    const dialogRef = this.dialog.open(InterceptLayersComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

