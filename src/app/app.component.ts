import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = 'https://www.w3schools.com/howto/img_avatar2.png';
  showImg = true;

  onLoaded(img: string) {
    console.log('log parent', img)
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }
}
