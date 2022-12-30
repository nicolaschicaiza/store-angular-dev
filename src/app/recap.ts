const username: string | number = 'nicobytes';
const names = "Nicolás";
const sum = (a: number, b: number) => {
  return a + b;
}
sum(1,2);

class Person {
  // private age: number;
  // lastName: string;

  constructor(private age:number, public lastName: string) {
    // this.age = age;
    // this.lastName = lastName;
  }
}

const nico = new Person(15, 'Chicaiza');
// nico.age; // Atributo privada de la clase
nico.lastName; // Atributo publico de la clase

