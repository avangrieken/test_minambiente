import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri;
import { MapService, Point } from '../services/map.service';

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  /*
  Variables de la clase
  */
  private _zoom = 10;
  private _center: Array<number> = [0.1278, 51.5074];
  private _basemap = "streets";
  private _loaded = false;
  private _view: esri.MapView = null;
  private _layersEsri: any = [];
  private _layersGeoJSON: any = [];
  private _layersWMS: any = [];
  private _layersWFS: any = [];
  private map: esri.Map;
  private layerList: esri.LayerList = null;
  popup: any;
  layersList: any = [];
  sketch: any;
  graphicsList: any = [];
  graphicsLayer: any;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Input()
  set layersEsri(listServices: any) {
    this._layersEsri = listServices;
  }

  get layersEsri(): any {
    return this._layersEsri;
  }

  @Input()
  set layersGeoJSON(listServices: any) {
    this._layersGeoJSON = listServices;
  }

  get layersGeoJSON(): any {
    return this._layersGeoJSON;
  }

  @Input()
  set layersWMS(listServices: any) {
    this._layersWMS = listServices;
  }

  get layersWMS(): any {
    return this._layersWMS;
  }

  @Input()
  set layersWFS(listServices: any) {
    this._layersWFS = listServices;
  }

  get layersWFS(): any {
    return this._layersWFS;
  }

  constructor(private mapService: MapService) { }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [
        EsriMap,
        EsriMapView,
        FeatureLayer,
        GeoJSONLayer,
        WMSLayer,
        //BasemapToggle,
        //BasemapGallery,
        LayerList,
        GraphicsLayer,
        Sketch
      ] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/layers/GeoJSONLayer",
        "esri/layers/WMSLayer",
        //"esri/widgets/BasemapToggle",
        //"esri/widgets/BasemapGallery",
        "esri/widgets/LayerList",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Sketch"
      ]);

      /// Permite la creacion de graficos sobre el mapa.
      this.graphicsLayer = new GraphicsLayer();

      // Configura el Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap,
        layers: [this.graphicsLayer]
      };

      /// Crea el objeto Map.
      this.map = new EsriMap(mapProperties);
      const map = this.map;

      // Inicializa el MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
        popup: {
          dockEnabled: true,
          dockOptions: {
            // Disables the dock button from the popup
            buttonEnabled: false,
            // Ignore the default sizes that trigger responsive docking
            breakpoint: false
          }
        }
      };

      // const basemapToggle = new BasemapToggle({
      //   view: mapViewProperties,
      //   nextBasemap: "topo"
      // });

      //mapViewProperties.ui.components.map(basemapToggle, "top-right");

      /// Cargue de capas personalizadas
      if (this._layersEsri && this._layersEsri.length > 0) {
        for (let index = 0; index < this._layersEsri.length; index++) {
          const service = this._layersEsri[index];
          if (service) {
            var esriLayer = new FeatureLayer({
              url: service.url,
              name: service.name
            });

            map.add(esriLayer);
          }
        }
      }

      /// Capa Geojson.
      if (this._layersGeoJSON && this._layersGeoJSON.length > 0) {
        for (let index = 0; index < this._layersGeoJSON.length; index++) {
          const layer = this._layersGeoJSON[index];
          if (layer) {
            const geojsonLayer = new GeoJSONLayer({
              url: layer
            });
            map.add(geojsonLayer);
          }
        }
      }

      /// Capa WMS.
      if (this._layersWMS && this._layersWMS.length > 0) {
        for (let index = 0; index < this._layersWMS.length; index++) {
          const layer = this._layersWMS[index];
          if (layer) {
            const layerWMS = new WMSLayer({
              url: layer.url,
              sublayers: [
                {
                  name: layer.name
                }
              ]
            });
            map.add(layerWMS);
          }
        }
      }

      /// Capa WFS.
      // if (this._layersWFS && this._layersWFS.length > 0) {
      //   for (let index = 0; index < this._layersWFS.length; index++) {
      //     const layer = this._layersWFS[index];
      //     if (layer) {
      //       const layerWFS = new WFSLayer({
      //         url: layer.url,
      //         version: layer.version,
      //         name: layer.name
      //       });
      //       map.add(layerWFS);
      //     }
      //   }
      // }


      this._view = new EsriMapView(mapViewProperties);

      // const basemapToggle = new BasemapToggle({
      //   view: this._view,
      //   nextBasemap: "topo"
      // });
      // this._view.ui.add(basemapToggle, "top-right");

      // var basemapGallery = new BasemapGallery({
      //   view: this._view,
      //   source: {
      //     portal: {
      //       url: "https://www.arcgis.com",
      //       useVectorBasemaps: true
      //     }
      //   }
      // });
      // this._view.ui.add(basemapGallery, "top-right");

      /// Tabla de contenido de mapa
      this.layerList = new LayerList({
        view: this._view
      });
      this._view.ui.add(this.layerList, "top-left");

      /// Herramienta de grafico
      this.sketch = new Sketch({
        view: this._view,
        layer: this.graphicsLayer,
        id: "Graficos_mapa"
      });
      this._view.ui.add(this.sketch, "top-right");

      this.popup = this._view.popup;

      await this._view.when(() => {
        //this._view.on("click", executeTask);
        /// Eventos al momento de cargar un layer
        this._view.on("layerview-create", (event) => {
          this.layersList.push(event.layer);
        });

        /// Eventos al momento de crear un gráfico
        this.sketch.on("create", (event: any) => {
          if (event.state === "complete") {
            this.graphicsList.push(event.graphic);
            //console.log(this.graphicsList)
            // var attributes = {
            //   name: "My Graphic",
            //   type: event.graphic.geometry.type
            // }
            // event.graphic.attributes = attributes;

            // var popupTemplate = {
            //   title: "{name}",
            //   content: "I am a {type}."
            // }
            // event.graphic.popupTemplate = popupTemplate;
          }
        });

      });
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    // Inicializar MapView y retornar una instancia de MapView
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView listo: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });

    /// Subcripcion a servicios
    this.mapService.zoomEmitter.subscribe((zoom: number) => {
      console.log('Zoom: ' + zoom);
      this._view.zoom = zoom;
    });
    this.mapService.centerEmitter.subscribe((center: Point) => {
      if (this._view.center.latitude !== center.lat || this._view.center.longitude !== center.lon) {
        this._view.goTo({
          center: [center.lon, center.lat]
        });
      }
    });
    this.mapService.loadServiceEmitter.subscribe((service: any) => {
      if (service) {
        this.loadServiceEsri(service);
      }
    });
    this.mapService.addShapeFileEmitter.subscribe((layers: any) => {
      if (layers) {
        this.addLayers(layers);
      }
    });
    this.mapService.getListLayersEmitter.subscribe(() => {
      this.getListLayers();
    });
    this.mapService.intersectEmitter.subscribe((url: string) => {
      if (url) {
        this.intersectLayers(url);
      }
    });

  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;
    }
  }

  async loadServiceEsri(service: any) {
    if (service && typeof service.url !== 'undefined') {

      const [FeatureLayer] = await loadModules([
        "esri/layers/FeatureLayer"
      ]);

      var esriLayer = new FeatureLayer({
        url: service.url
      });

      this.map.add(esriLayer);
    }
  }

  async addLayers(layers: any) {
    if (layers) {
      let fullExtent: any;
      const [FeatureLayer, arrayUtils, InfoTemplate] = await loadModules([
        "esri/layers/FeatureLayer",
        "dojo/_base/array",
        "esri/InfoTemplate",
      ]);

      arrayUtils.forEach(layers.layers, (layer: any) => {
        let infoTemplate = new InfoTemplate("Details", "${*}");
        let featureLayer = new FeatureLayer(layer, {
          infoTemplate: infoTemplate
        });
        // Evento Click Ft
        featureLayer.on('click', (event: any) => {
          //this.map.infoWindow.setFeatures([event.graphic]);
        });
        //Cambio de simbologia
        this.changeRenderer(featureLayer);
        fullExtent = fullExtent ? fullExtent.union(featureLayer.fullExtent) : featureLayer.fullExtent;
        this.map.add(featureLayer);
      });

      const zoom = fullExtent.expand(1.25);
      if (zoom) {
        this._view.goTo(zoom);
      }
    }
  }

  async changeRenderer(layer: any) {
    //change the default symbol for the feature collection for polygons and points
    var symbol = null;
    const [SimpleRenderer, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color] = await loadModules([
      "esri/renderers/SimpleRenderer",
      "esri/symbols/PictureMarkerSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/Color"
    ]);

    switch (layer.geometryType) {
      case 'esriGeometryPoint':
        symbol = new PictureMarkerSymbol({
          'angle': 0,
          'xoffset': 0,
          'yoffset': 0,
          'type': 'esriPMS',
          'url': 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
          'contentType': 'image/png',
          'width': 20,
          'height': 20
        });
        break;
      case 'esriGeometryPolygon':
        symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([112, 112, 112]), 1), new Color([136, 136, 136, 0.25]));
        break;
    }
    if (symbol) {
      layer.setRenderer(new SimpleRenderer(symbol));
    }
  }

  getListLayers() {
    let listLayers: any = [];
    if (this.layersList) {
      this.map.layers.forEach((layer: any) => {
        const sourceJSON = layer.sourceJSON;
        listLayers.push({
          id: layer.id,
          name: sourceJSON && sourceJSON.name ? sourceJSON.name : "Gráfico Mapa",
          url: layer.url,
          //sublayers: layer.sublayers,
          layerId: layer.layerId
          //sourceJSON: layer.sourceJSON
        });
      });
    }

    localStorage.setItem("listLayers", JSON.stringify(listLayers));
  }

  /// Interceptar capas de mapa con graficos.
  async intersectLayers(url: string) {
    if (url) {
      const [geometryEngine, FeatureLayer, Graphic, geometryEngineAsync] = await loadModules([
        "esri/geometry/geometryEngine",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/geometryEngineAsync"
      ]);

      const featureLayer = new FeatureLayer({
        url,
        mode: FeatureLayer.MODE_ONDEMAND,
        maxAllowableOffset: this.calcOffset()
      });

      //console.log(this.calcOffset())

      var query = {
        outFields: ["*"],
        returnGeometry: true,
        where: "1=1"
      };

      featureLayer.queryFeatures(query).then((result: any) => {
        // console.log(result.features)
        // console.log(this.graphicsList[0].geometry)

        let geometrys: any = [];

        result.features.forEach((layer: any) => {
          geometrys.push(layer.geometry);
        });

        debugger

        console.log(this.graphicsList[0].geometry)
        console.log(geometrys)

        geometryEngineAsync.intersect(this.graphicsList[0].geometry, geometrys)
          .then(
            (features: any) => {
              this.graphicsLayer.removeAll();
              features.forEach((feature: any) => {
                var g = new Graphic({
                  geometry: feature.geometry,
                  attributes: feature.attributes,
                  popupTemplate: {
                    title: "",
                    content: "{*}"
                  }
                });
                this.graphicsLayer.add(g);
              });
            },
            (err: any) => { console.log(err); }
          );

        // let intersects = geometryEngine.intersect(this.graphicsList[0].geometry, geometrys);
        // if (intersects) {
        //   this.graphicsLayer.removeAll();
        //   result.features.forEach((feature: any) => {
        //     var g = new Graphic({
        //       geometry: feature.geometry,
        //       attributes: feature.attributes,
        //       popupTemplate: {
        //         title: "",
        //         content: "{*}"
        //       }
        //     });
        //     // var g = new Graphic({
        //     //   geometry: feature.geometry,
        //     //   attributes: feature.attributes,
        //     //   symbol: {
        //     //    type: "simple-marker",
        //     //     color: [0,0,0],
        //     //     outline: {
        //     //      width: 2,
        //     //      color: [0,255,255],
        //     //    },
        //     //     size: "20px"
        //     //   },
        //     //   popupTemplate: {
        //     //    title: "",
        //     //    content: "{*}"
        //     //   }
        //     // });
        //     this.graphicsLayer.add(g);
        //   });
        // }
      });
    }
  }

  /// Calcular extension para cargar datos
  calcOffset() {
    return (this._view.extent.width / this._view.width);
  }
}
