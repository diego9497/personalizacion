import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import { fabric } from "fabric";

import "fabric-customise-controls";

import exportFromJSON from "export-from-json";

import dataJson from "./data.json";
import { resolve } from "url";

//https://stackoverflow.com/questions/42833142/prevent-fabric-js-objects-from-scaling-out-of-the-canvas-boundary

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

    let img1 = null;
    let img2 = null;
    fabric.Image.fromURL(
      "/assets/despiece/1.webp",
      img => {
        let filtro = new fabric.Image.filters.Sepia();
        filtro = new fabric.Image.filters.BlendColor({
          color: "#4CEE67",
          alpha: 1
        });
        img.filters.push(filtro);
        img.applyFilters();
        this.removeControls(img);
        this.canvas.add(img);
      },
      {
        scaleX: 0.3,
        scaleY: 0.3,
        crossOrigin: "",
        top: 50,
        left: 20
      }
    );
    fabric.Image.fromURL(
      "/assets/despiece/2.webp",
      img => {
        let filtro = new fabric.Image.filters.Sepia();
        filtro = new fabric.Image.filters.BlendColor({
          color: "#F00",
          alpha: 1
        });
        console.log("Filtro", filtro);
        img.filters.push(filtro);
        img.applyFilters();
        this.removeControls(img);
        this.canvas.add(img);
      },
      {
        scaleX: 0.3,
        scaleY: 0.3,
        crossOrigin: "",
        top: 50,
        left: 20
      }
    );

    this.canvas.on("object:scaling", e => {
      this.handleScaling(e);
    });

    // this.canvas.on("after:render", () => {
    //   this.canvas.forEachObject(obj => {
    //     let bound = obj.getBoundingRect();
    //     // @ts-ignore
    //     this.canvas.contextContainer.strokeRect(
    //       bound.left + 0.5,
    //       bound.top + 0.5,
    //       bound.width,
    //       bound.height
    //     );
    //   });
    // });

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

    // @ts-ignore
    fabric.Canvas.prototype.customiseControls(
      {
        tl: {
          cursor: "pointer",
          action: function(
            e,
            target: fabric.Rect | fabric.IText | fabric.Circle
          ) {
            let copia;
            target.canvas.getActiveObject().clone(clone => {
              copia = clone;
              console.log(clone);
            });

            // copia.padding = 10;
            copia.setControlsVisibility({
              ml: false,
              mr: false,
              mt: false,
              mb: false,
              mtr: false
            });

            copia.set({
              top:
                (target.canvas.getHeight() - copia.height * copia.scaleY) / 2,
              left: (target.canvas.getWidth() - copia.width * copia.scaleX) / 2
            });
            copia.setCoords();
            target.canvas.add(copia);
            target.canvas.renderAll();
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
      },
      function() {
        // this.renderAll();
      }
    );
    // @ts-ignore
    fabric.Object.prototype.customiseCornerIcons(
      {
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
      },
      function() {
        // this.renderAll();
      }
    );

    this.canvas.loadFromJSON({ ...dataJson }, () => {
      this.canvas._objects.forEach(obj => {
        this.removeControls(obj);
      });
    });
    this.generatePreview();
  }
  private clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
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

    // let data = this.canvas.toJSON();
    // exportFromJSON({ data, fileName: "data", exportType: "json" });
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
      obj.set({
        top: this.canvas.getHeight() / 2,
        left: this.canvas.getWidth() / 2
      });
      obj.setCoords();
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

  handleScaling = e => {
    var obj = e.target;
    var brOld = obj.getBoundingRect();
    obj.setCoords();
    var brNew = obj.getBoundingRect();
    // left border
    // 1. compute the scale that sets obj.left equal 0
    // 2. compute height if the same scale is applied to Y (we do not allow non-uniform scaling)
    // 3. compute obj.top based on new height
    if (brOld.left >= 0 && brNew.left < 0) {
      let scale = (brOld.width + brOld.left) / obj.width;
      let height = obj.height * scale;
      let top =
        ((brNew.top - brOld.top) / (brNew.height - brOld.height)) *
          (height - brOld.height) +
        brOld.top;
      this._setScalingProperties(
        0 + brNew.width / 2,
        top + brNew.height / 2,
        scale
      );
    }

    // top border
    if (brOld.top >= 0 && brNew.top < 0) {
      let scale = (brOld.height + brOld.top) / obj.height;
      let width = obj.width * scale;
      let left =
        ((brNew.left - brOld.left) / (brNew.width - brOld.width)) *
          (width - brOld.width) +
        brOld.left;
      this._setScalingProperties(
        left + brNew.width / 2,
        0 + brNew.height / 2,
        scale
      );
    }
    // right border
    if (
      brOld.left + brOld.width <= obj.canvas.width &&
      brNew.left + brNew.width > obj.canvas.width
    ) {
      let scale = (obj.canvas.width - brOld.left) / obj.width;
      let height = obj.height * scale;
      let top =
        ((brNew.top - brOld.top) / (brNew.height - brOld.height)) *
          (height - brOld.height) +
        brOld.top;
      this._setScalingProperties(
        brNew.left + brNew.width / 2,
        top + brNew.height / 2,
        scale
      );
    }
    // bottom border
    if (
      brOld.top + brOld.height <= obj.canvas.height &&
      brNew.top + brNew.height > obj.canvas.height
    ) {
      let scale = (obj.canvas.height - brOld.top) / obj.height;
      let width = obj.width * scale;
      let left =
        ((brNew.left - brOld.left) / (brNew.width - brOld.width)) *
          (width - brOld.width) +
        brOld.left;
      this._setScalingProperties(
        left + brNew.width / 2,
        brNew.top + brNew.height / 2,
        scale
      );
    }

    if (
      brNew.left < 0 ||
      brNew.top < 0 ||
      brNew.left + brNew.width > obj.canvas.width ||
      brNew.top + brNew.height > obj.canvas.height
    ) {
      obj.left = this.scalingProperties["left"];
      obj.top = this.scalingProperties["top"];
      obj.scaleX = this.scalingProperties["scale"];
      obj.scaleY = this.scalingProperties["scale"];
      obj.setCoords();
    } else {
      this.scalingProperties = null;
    }
  };
  _setScalingProperties = (left, top, scale) => {
    if (
      this.scalingProperties == null ||
      this.scalingProperties["scale"] > scale
    ) {
      this.scalingProperties = {
        left: left,
        top: top,
        scale: scale
      };
    }
  };
}
