////// Importamos los componentes que requerimos.
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* 
   Interface para definir modelo 
 */
export interface Point {
  lon: number;
  lat: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  /* 
    Variables locales 
  */
  private mapZoom = 6;
  private mapCenter: Point = { lat: -74.1194, lon: 6.7749 };

  esriCenter: Point = { lat: -74.1194, lon: 6.7749 };
  esriZoom = 6;

  /// Emitir eventos que escucha el objeto mapa.
  @Output() zoomEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() centerEmitter: EventEmitter<Point> = new EventEmitter<Point>();
  @Output() loadServiceEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() addShapeFileEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() getListLayersEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() intersectEmitter: EventEmitter<any> = new EventEmitter<any>();

  /// URL servicio ArcGIS para subir Shape
  readonly API_SERVICE_ESRI: string = "https://www.arcgis.com";

  constructor(private http: HttpClient) { }

  /// Cargar servicios
  loadService(service: any) {
    this.loadServiceEmitter.next(service);
  }

  /* 
    Métodos y utitlidades de Mapa
  */
  setCenter(p: Point) {
    this.mapCenter = p;
    this.centerEmitter.next(this.mapCenter);
  }
  get center() {
    return this.mapCenter;
  }

  setZoom(z: number) {
    this.mapZoom = z;
    this.zoomEmitter.next(this.mapZoom);
  }

  get zoom() {
    return this.mapZoom;
  }

  setEsriZoom(zoom: number) {
    this.esriZoom = zoom;
  }

  setEsriCenter(point: Point) {
    this.esriCenter = point;
  }

  /// Enviar el shape al servicio para generar la capa
  loadShapeFile(formData: any): Observable<any> {
    return this.http.post<any[]>(`${this.API_SERVICE_ESRI}/sharing/rest/content/features/generate`,
      {
        formData
      });
  }

  /// Agregar el shape al mapa
  addShapeFile(layers: any) {
    this.addShapeFileEmitter.next(layers);
  }

  /// Obtener lista de capas de mapa
  getListLayers() {
    //this.getListLayersEmitter.emit();
    this.getListLayersEmitter.next();
  }

  /// Interceptar capas y graficos de mapa
  intersect(url: string) {
    this.intersectEmitter.next(url);
  }
}
