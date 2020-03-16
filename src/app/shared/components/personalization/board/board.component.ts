import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import { fabric } from "fabric";

import "fabric-customise-controls";

import dataJson from "./data.json";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit, AfterViewInit {
  public canvas: fabric.Canvas;
  // public canvas: any;

  url = "/assets/background/camiseta-blanca2.png";
  urlMarca = "/assets/marca/exito.png";
  urlImg1 = "";
  urlPreview = "";
  top = 100;
  left = 90;

  scaleX = 1;
  scaleY = 1;
  scalingProperties = null;

  @ViewChild("container", { static: true }) canvasContainer: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas("canvas", {
      preserveObjectStacking: true,
      controlsAboveOverlay: true
    });
    let height = 300;
    let width = 220;
    this.canvas.setHeight(height);
    this.canvas.setWidth(width);

    this.canvas.on("selection:created", e => {
      if (e.target.type === "activeSelection") {
        this.canvas.discardActiveObject();
      }
    });

    this.canvas.on("object:scaling", e => {
      let obj = this.canvas.getActiveObject();
      obj.lockScalingX = false;
      obj.lockScalingY = false;
      obj.setCoords();
      let boundNext = obj.getBoundingRect();

      if (
        boundNext.left + boundNext.width >= this.canvas.getWidth() ||
        boundNext.left <= 0 ||
        boundNext.top <= 0 ||
        boundNext.top + boundNext.height >= this.canvas.getHeight()
      ) {
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.setCoords();
      }
    });

    this.canvas.on("object:rotating", e => {
      let obj = this.canvas.getActiveObject();
      obj.lockRotation = false;
      obj.setCoords();
      let boundNext = obj.getBoundingRect();

      if (
        boundNext.left + boundNext.width >= this.canvas.getWidth() ||
        boundNext.left <= 0 ||
        boundNext.top <= 0 ||
        boundNext.top + boundNext.height >= this.canvas.getHeight()
      ) {
        obj.lockRotation = true;
        obj.setCoords();
      }
    });

    this.canvas.on("object:scaled", e => {
      let obj = this.canvas.getActiveObject();
      obj.lockScalingX = false;
      obj.lockScalingY = false;
      obj.setCoords();
    });
    this.canvas.on("object:rotated", e => {
      let obj = this.canvas.getActiveObject();
      obj.lockRotation = false;
      obj.setCoords();
    });

    this.canvas.on("object:moving", () => {
      let obj = this.canvas.getActiveObject();
      let bound = obj.getBoundingRect(true, true);

      if (bound.top <= 0) {
        obj.set({
          top: bound.height / 2
        });
      }
      if (bound.top + bound.height >= this.canvas.getHeight()) {
        obj.set({ top: this.canvas.getHeight() - bound.height / 2 - 1 });
      }
      if (bound.left <= 0) {
        obj.set({
          left: bound.width / 2
        });
      }
      if (bound.left + bound.width >= this.canvas.getWidth()) {
        obj.set({
          left: this.canvas.getWidth() - bound.width / 2 - 1
        });
      }
      obj.setCoords();
    });

    this.loadImages();

    // @ts-ignore
    fabric.Canvas.prototype.customiseControls({
      tl: {
        cursor: "pointer",
        action: function(e, target: fabric.Image | fabric.Group) {
          let copia;
          target.canvas.getActiveObject().clone(clone => {
            copia = clone;
            // copia.padding = 10;
            copia.setControlsVisibility({
              ml: false,
              mr: false,
              mt: false,
              mb: false,
              mtr: false
            });

            target.canvas.add(copia);
            copia.center();
            target.canvas.renderAll();
          });
        }
      },
      tr: {
        action: "rotate",
        cursor: "grabbing"
      },
      bl: {
        action: "remove",
        cursor: "pointer"
      },
      br: {
        cursor: "nw-resize"
      }
    });

    // @ts-ignore
    fabric.Object.prototype.customiseCornerIcons({
      settings: {
        borderColor: "#bbb",
        cornerSize: 22,
        cornerShape: "rect",
        cornerBackgroundColor: "#e6e6e6",
        cornerPadding: 5
      },
      tl: {
        icon: "assets/icons/duplicate.svg"
      },
      tr: {
        icon: "assets/icons/rotate.svg"
      },
      bl: {
        icon: "assets/icons/delete.svg"
      },
      br: {
        icon: "assets/icons/resize.svg"
      }
    });

    this.canvas.loadFromJSON({ ...dataJson }, () => {
      this.canvas._objects.forEach(obj => {
        this.removeControls(obj);
      });
    });
    this.generatePreview();
  }

  loadImages = async () => {
    let images = [
      {
        url: "/assets/despiece/5.rostro.png",
        color: "#FFFF73"
      },
      {
        url: "/assets/despiece/2.ojos.png",
        color: "#8C0000"
      },
      {
        url: "/assets/despiece/3.boca.png",
        color: "#FF7373"
      },
      {
        url: "/assets/despiece/4.pelo.png",
        color: "#000000"
      },
      {
        url: "/assets/despiece/6.Borde rostro.png",
        color: "#000000"
      }
    ];

    // let images = [
    //   {
    //     url: "/assets/despiece/1.webp",
    //     color: "#000"
    //   },
    //   {
    //     url: "/assets/despiece/2.webp",
    //     color: "#fff"
    //   }
    // ];

    let group = [];
    let height = 0;
    let width = 0;
    for (let i = 0; i < images.length; i++) {
      let image = await this.createImage(images[i]);
      height = image.height;
      width = image.width;
      group.push(image);
    }

    let factor = height / this.canvas.getHeight();
    factor = 0.8 / factor;
    while (
      width * factor >= this.canvas.getWidth() ||
      height * factor >= this.canvas.getHeight()
    ) {
      factor -= 0.1;
    }

    let image = new fabric.Group(group, {
      scaleX: factor,
      scaleY: factor,
      originX: "center",
      originY: "center"
    });
    image.centeredScaling = true;
    this.removeControls(image);
    this.canvas.add(image);
    image.center();
    this.canvas.setActiveObject(image);
    this.canvas.renderAll();
  };

  createImage = async img => {
    let imgDom = await this.loadImage(img.url);
    //@ts-ignore
    let imgFabric = new fabric.Image(imgDom, {
      crossOrigin: ""
    });
    let filtro = new fabric.Image.filters.BlendColor({
      color: img.color,
      alpha: 1
    });

    imgFabric.filters.push(filtro);
    imgFabric.applyFilters();
    this.removeControls(imgFabric);
    imgFabric.center();
    return imgFabric;
  };

  loadImage = src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });
  };

  private generateDesign = () => {
    this.urlImg1 = this.canvas.toDataURL({
      format: "png",
      quality: 1
    });
    this.canvas.renderAll();
  };

  generatePreview = () => {
    this.generateDesign();

    let canvas2 = new fabric.Canvas("c4");
    canvas2.setWidth(410);
    canvas2.setHeight(547);

    fabric.Image.fromURL(this.url, img => {
      canvas2.backgroundImage = img;
    });
    fabric.Image.fromURL(this.urlImg1, img => {
      img.set({
        top: this.top,
        left: this.left
      });
      canvas2.add(img);
    });
    canvas2.renderAll();

    setTimeout(() => {
      this.urlPreview = canvas2.toDataURL({
        format: "png",
        quality: 1
      });
    }, 500);
  };

  moveToUp = () => {
    if (this.canvas.getActiveObject()) {
      let obj = this.canvas.getActiveObject();
      let currentIndex = this.canvas.getObjects().indexOf(obj);
      obj.moveTo(currentIndex + 1);
    }
  };

  moveToDown = () => {
    if (this.canvas.getActiveObject()) {
      let obj = this.canvas.getActiveObject();
      let currentIndex = this.canvas.getObjects().indexOf(obj);
      obj.moveTo(currentIndex - 1);
    }
  };

  centerObject = () => {
    if (this.canvas.getActiveObject()) {
      let obj = this.canvas.getActiveObject();
      obj.center();
      this.canvas.renderAll();
    }
  };
  clearCanvas = () => {
    this.canvas.clear();
  };

  removeControls = obj => {
    obj.setControlVisible("ml", false);
    obj.setControlVisible("mr", false);
    obj.setControlVisible("mt", false);
    obj.setControlVisible("mb", false);
    obj.setControlVisible("mtr", false);
    // obj.padding = 10;
  };
}
