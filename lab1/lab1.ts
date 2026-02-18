export interface User{
    id:number;
    name:string;
    email?:string;
    isActive:boolean;
}
export function createUser(id:number, name:string, email?:string):User{
    return {
        id:id,
        name:name,
        email:email,
        isActive: true
    }
}
export interface Book{
    title:string;
    author:string;
    year?:number;
    genre:'fiction' | 'non-fiction';
}
export function createBook(book:Book):Book{
    return book;
}
export const book1=createBook({
    title:"книга1",
    author:"Автор",
    year:1998,
    genre:"fiction"
});
export const book2=createBook({
    title:"книга1",
    author:"Автор",
    genre:"fiction"
});
export function calculateArea(shape: 'circle', dimensions: { radius: number }): number;
export function calculateArea(shape: 'square', dimensions: { side: number }): number;

export function calculateArea(shape: 'circle' | 'square', dimensions: any): number {
    if (shape === 'circle') {
        return Math.PI * dimensions.radius ** 2;
    }
    return dimensions.side ** 2;
}
console.log(calculateArea('circle', { radius: 5 }));
console.log(calculateArea('square', { side: 4 }));

type Status="active"|"inactive"|"new";
export function getStatusColor(status:Status):string{
    if (status==="active") return "green"
    else if(status==="new") return "yellow"
    else return "red"
}
console.log("active",getStatusColor("active"))
console.log("inactive", getStatusColor("inactive"))
console.log("new",getStatusColor("new"))

type StringFormatter=(str:string, uppercase?:boolean)=>string;
export const UpperFirst: StringFormatter=(str:string,uppercase:boolean=false):string=>{
    if (str.length==0) return str;
    let result:string=str[0].toUpperCase()+str.slice(1,str.length).toLowerCase();
    return uppercase? result.toUpperCase() : result;
}
export const TrimStr: StringFormatter=(str:string,uppercase:boolean=false):string=>{
    if (str.length==0) return str;
    const trimmed:string=str.trim();
    return uppercase? trimmed.toUpperCase():trimmed;
}
console.log(UpperFirst("gsdgdsgd"));
console.log(TrimStr("    gggg    "), true);

export function getFirstElement<T>(arr: T[]): T | undefined {
    if (arr.length==0) return undefined;
    return arr[0];
}
const numbers = [10, 20, 30];
const strings = ['a', 'b', 'c'];
const emptyArray: number[] = [];

console.log('Первый элемент чисел:', getFirstElement(numbers));
console.log('Первый элемент строк:', getFirstElement(strings));
console.log('Пустой массив:', getFirstElement(emptyArray));

interface HasId{
    id:number;
}

interface HasId {
    id: number;
}

export interface User1 extends HasId {
    name: string;
    email?: string;
}

const users: User1[] = [
    { id: 1, name: 'Иван', email: 'ivan@mail.com' },
    { id: 2, name: 'Мария', email: 'maria@mail.com' },
    { id: 3, name: 'Петр' }
];

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}

console.log('Поиск id=2:', findById(users, 2));
console.log('Поиск id=99:', findById(users, 99));



