import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Points } from '../models/zone.model';

@Component({
  selector: 'app-intersection',
  templateUrl: './intersection.component.html',
  styleUrls: ['./intersection.component.scss']
})
export class IntersectionComponent implements AfterViewInit {
  @ViewChild('intersection', { static: false }) intersection!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;

  private points: Points = [[185.5,156],[500,164],[146,347],[431,331]];
  private selectedPointIndex: number | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  ngAfterViewInit() {
    this.context = this.intersection.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.setupMouseListeners();
    if(this.points.length === 4){
      this.drawShapes()
    }
  }

  setupMouseListeners() {
    this.intersection.nativeElement.addEventListener('mousedown', (event) => {
      const rect = this.intersection.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (let i = 0; i < this.points.length; i++) {
        const point = this.points[i];
        const distance = Math.sqrt((point[0] - x) ** 2 + (point[1] - y) ** 2);
        if (distance <= 10) {
          this.selectedPointIndex = i;
          this.offsetX = x - point[0];
          this.offsetY = y - point[1];
          return;
        }
      }

      if (this.points.length < 4) {
        this.addPoint(x, y);
        console.log(this.points)
      }
    });

    this.intersection.nativeElement.addEventListener('mousemove', (event) => {
      if (this.selectedPointIndex !== null) {
        const rect = this.intersection.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.movePoint(this.selectedPointIndex, x - this.offsetX, y - this.offsetY);
      }
    });

    this.intersection.nativeElement.addEventListener('mouseup', () => {
      this.selectedPointIndex = null;
    });
  }

  addPoint(x: number, y: number) {
    this.points.push([ x, y ]);
    this.drawShapes();
  }

  movePoint(index: number, x: number, y: number) {
    this.points[index] = [ x, y ];
    this.drawShapes();
  }

  drawShapes() {
    this.clearCanvas();
    for (const point of this.points) {
      this.drawCircle(point[0], point[1], 10);
    }

    if (this.points.length === 4) {
      this.drawPolygon();
    }
  }

  drawCircle(x: number, y: number, radius: number) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = 'red';
    this.context.fill();
    this.context.strokeStyle = 'black';
    this.context.stroke();
  }

  drawPolygon() {
    this.context.beginPath();
    this.context.moveTo(this.points[0][0], this.points[0][1]);

    for (const point of this.points) {
      this.context.lineTo(point[0], point[1]);
    }

    this.context.closePath();
    this.context.fillStyle = 'blue';
    this.context.strokeStyle = 'black';
    this.context.fill();
    this.context.stroke();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.intersection.nativeElement.width, this.intersection.nativeElement.height);
  }
}
