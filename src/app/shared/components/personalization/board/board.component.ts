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
      let bound = obj.getBoundingRect();
      if (
        bound.width >= this.canvas.getWidth() ||
        bound.height >= this.canvas.getHeight()
      ) {
        obj.scaleX = this.scaleX;
        obj.scaleY = this.scaleY;
        this.canvas.renderAll();
      } else {
        this.scaleX = obj.scaleX;
        this.scaleY = obj.scaleY;
        this.canvas.renderAll();
      }
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
}
