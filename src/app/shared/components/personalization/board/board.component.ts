import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import { fabric } from "fabric";

import "fabric-customise-controls";
import { IEvent } from "fabric/fabric-impl";
import { BoundDirectivePropertyAst } from "@angular/compiler";

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

  @ViewChild("container", { static: true }) canvasContainer: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas("canvas");
    let height = 300;
    let width = 220;
    this.canvas.setHeight(height);
    this.canvas.setWidth(width);

    this.canvas.on("selection:created", e => {
      if (e.target.type === "activeSelection") {
        this.canvas.discardActiveObject();
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

    // this.canvas.on("object:moving", () => {
    //   let obj = this.canvas.getActiveObject();
    //   console.log("Object mooving ? ");
    //   let bound = obj.getBoundingRect();
    //   console.log(obj.top, obj.left);
    //   console.log(bound.top, bound.left);

    //   if (bound.left <= 0) {
    //     console.log("Left");
    //     obj.set({
    //       left: 0
    //     });
    //   }
    //   if (bound.left + bound.width > this.canvas.getWidth()) {
    //     console.log("Right");
    //     obj.set({
    //       left: this.canvas.getWidth() - bound.width - 1
    //     });
    //   }
    //   if (bound.top < 0) {
    //     console.log("Top");
    //     obj.set({
    //       top: 0 + 1
    //     });
    //   }
    //   if (bound.top + bound.height > this.canvas.getHeight()) {
    //     console.log("Bottom");
    //     obj.set({ top: this.canvas.getHeight() - bound.height - 1 });
    //   }
    //   obj.setCoords();
    // });

    this.canvas.on("object:moving", () => {
      let obj = this.canvas.getActiveObject();
      console.log("Object mooving ? ");
      let bound = obj.getBoundingRect();
      console.log(obj.top, obj.left);
      console.log(bound.top, bound.left);

      if (bound.left < 0) {
        console.log("Left");
        obj.set({
          left: 0
        });
        // bound.left = 0 + 1;
      }
      if (bound.left + bound.width > this.canvas.getWidth()) {
        console.log("Right");
        obj.set({
          left: this.canvas.getWidth() - bound.width - 1
        });
        // bound.left = this.canvas.getWidth() - bound.width - 1;
      }
      if (bound.top < 0) {
        console.log("Top");
        obj.set({
          top: 0
        });
        // bound.top = 0 + 1;
      }
      if (bound.top + bound.height > this.canvas.getHeight()) {
        console.log("Bottom");
        obj.set({ top: this.canvas.getHeight() - bound.height - 1 });
      }
      obj.setCoords();
    });

    this.canvas.on("object:moved", () => {
      let obj = this.canvas.getActiveObject();
      console.log("Object mooving ? ");
      let bound = obj.getBoundingRect();
      // console.log(obj.top, obj.left);
      // console.log(bound.top, bound.left);

      if (bound.left < 0) {
        console.log("Left");
        obj.set({
          left: 0
        });
        // bound.left = 0 + 1;
      }
      if (bound.left + bound.width > this.canvas.getWidth()) {
        console.log("Right");
        obj.set({
          left: this.canvas.getWidth() - bound.width - 1
        });
        // bound.left = this.canvas.getWidth() - bound.width - 1;
      }
      if (bound.top < 0) {
        console.log("Top");
        obj.set({
          top: 0
        });
        // bound.top = 0 + 1;
      }
      if (bound.top + bound.height > this.canvas.getHeight()) {
        console.log("Bottom");
        obj.set({ top: this.canvas.getHeight() - bound.height - 1 });
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

    let rect = new fabric.Rect({
      width: 50,
      height: 60
    });

    this.removeControls(rect);
    this.canvas.add(rect);
    let rect2 = new fabric.Rect({
      height: 40,
      width: 40,
      fill: "red",
      top: 100,
      left: 50
    });
    this.removeControls(rect2);
    this.canvas.add(rect2);

    let rect3 = new fabric.Rect({
      height: 60,
      width: 60,
      fill: "green",
      top: 180,
      left: 90
    });
    this.removeControls(rect3);
    this.canvas.add(rect3);

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
