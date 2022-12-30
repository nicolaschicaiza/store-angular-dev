import { Component } from '@angular/core';
import { Product } from './product.mode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  widthImg = 10;
  name = 'Nicolás'; // public
  age = 18;
  img = "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60";
  btnDisabled = true;
  person = {
    name: "Nicolas",
    age: 18,
    avatar: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  }
  names: (string | number)[] = ['Nico', 'Juli', 'Santi', 12];
  newName = '';
  products: Product[] = [
    {
      name: 'El mejor juguete',
      price: 565,
      category: 'Fav',
      image: './assets/images/toy.jpg'
    },
    {
      name: 'Bicicleta casi nueva',
      price: 356,
      image: './assets/images/bike.jpg'
    },
    {
      name: 'Colleción de albumnes',
      price: 34,
      image: './assets/images/album.jpg'
    },
    {
      name: 'Mis libros',
      price: 23,
      image: './assets/images/books.jpg'
    },
    {
      name: 'Casa para perro',
      price: 34,
      image: '../assets/images/house.jpg'
    },
    {
      name: 'Gafas',
      price: 343,
      image: './assets/images/glasses.jpg'
    }

  ]

  // Reto
  components: string[] = ['mouse', 'keyborad', 'display', 'printer'];
  newComponent = '';

  toggleButton() {
    this.btnDisabled = !this.btnDisabled;
  }

  increaseAge() {
    this.person.age += 1;
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    console.log(element.scrollTop);
  }

  changeName(event: Event) {
    const element = event.target as HTMLInputElement;
    this.person.name = element.value;
  }

  addName() {
    this.names.push(this.newName);
    this.newName = '';
  }

  deleteName(index: number) {
    this.names.splice(index, 1); // Posición dentro del array, número de objetos a eliminar
  }

  addComponent() {
    this.components.push(this.newComponent);
    this.newComponent = '';
  }

  deleteComponent(index: number) {
    this.components.splice(index, 1);
  }
}
