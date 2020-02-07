import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import "fabric";

declare const fabric;

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  private canvas: any;

  constructor() {}

  ngOnInit() {
    this.canvas = new fabric.Canvas("canvas");
    const circulo = new fabric.Cirlce({
      radius: 20,
      fill: "green",
      left: 10,
      top: 50
    });
    this.canvas.add(circulo);
    this.canvas.setWidth(580);
    this.canvas.setHeight(600);
  }
}
