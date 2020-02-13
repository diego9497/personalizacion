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

  @ViewChild("container", { static: true }) canvasContainer: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas("canvas");
    let height = this.canvasContainer.nativeElement.clientHeight;
    let width = this.canvasContainer.nativeElement.clientWidth;
    this.canvas.setHeight(height);
    this.canvas.setWidth(width);
    //let url = "https://cdn.shopify.com/s/files/1/2232/3715/products/8436567654301_CAMISETA_VAMOS_MIGUELITO_T19CAVAMIM__003_1920x.png?v=1548864278";
    let url = "/assets/background/camiseta-blanca2.png";
    // let img: fabric.Image;
    fabric.Image.fromURL(url, img => {
      console.log(img);
      this.canvas.backgroundImage = img;

      this.canvas.backgroundImage.scaleToWidth(width);
      this.canvas.backgroundImage.scaleToHeight(height);
      console.log(this.canvas.backgroundImage.width);
      console.log(this.canvas.backgroundImage.height);
      this.canvas.renderAll();
    });

    let circle = new fabric.Circle({
      radius: 50
    });
    this.canvas.add(circle);
    this.canvas.on("object:moving", e => {
      var obj = e.target;

      obj.set({
        top: this.clamp(obj.top, 0, obj.canvas.height - obj.height),
        left: this.clamp(obj.left, 0, obj.canvas.width - obj.width)
      });
      obj.setCoords();
    });
  }
  private clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }
}
