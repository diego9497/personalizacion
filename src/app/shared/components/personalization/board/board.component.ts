import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";

import { fabric } from "fabric";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit, AfterViewInit {
  private canvas: fabric.Canvas;
  // private canvas: any;

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
    this.canvas = new fabric.Canvas("canvas", {
      backgroundColor: "transparent"
    });
    let height = 300;
    let width = 220;
    this.canvas.setHeight(height);
    this.canvas.setWidth(width);

    // fabric.Image.fromURL(url, img => {
    //   console.log(img);
    //   this.canvas.backgroundImage = img;

    //   this.canvas.backgroundImage.scaleToWidth(width);
    //   this.canvas.backgroundImage.scaleToHeight(height);
    //   console.log(this.canvas.backgroundImage.width);
    //   console.log(this.canvas.backgroundImage.height);
    //   this.canvas.renderAll();
    // });

    let rect = new fabric.Rect({
      width: 50,
      height: 60
    });
    this.canvas.add(rect);
    let circle = new fabric.Circle({
      radius: 50,
      fill: "red",
      top: 100,
      left: 50
    });
    this.canvas.add(circle);

    let circle2 = new fabric.Circle({
      radius: 70,
      fill: "green",
      top: 180,
      left: 90
    });
    this.canvas.add(circle2);

    // this.canvas.on("object:moving", e => {
    //   let obj = e.target;
    //   obj.setCoords();

    //   let bound = obj.getBoundingRect();

    //   console.log(bound);
    //   obj.set({
    //     top: this.clamp(bound.top, 0, this.canvas.height - bound.height + 1),
    //     left: this.clamp(bound.left, 0, this.canvas.width - bound.width + 1)
    //   });
    //   // }
    // });

    this.generatePreview();
  }
  private clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }

  private generateDesign() {
    this.urlImg1 = this.canvas.toDataURL({
      format: "png",
      quality: 1
    });
    this.canvas.renderAll();
  }

  private generatePreview() {
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
    }, 200);
  }
}
