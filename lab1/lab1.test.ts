import { describe, it, expect } from 'vitest';
import {
    createUser,
    createBook,
    calculateArea,
    getStatusColor,
    UpperFirst,
    TrimStr,
    getFirstElement,
    findById,
    Book,
    User,
    User1
} from './lab1';

describe('Тесты для лабораторной работы 1', () => {

    it('createUser: должен создавать пользователя с email', () => {
        const user: User = createUser(1, 'Иван', 'ivan@mail.com');

        expect(user).toEqual({
            id: 1,
            name: 'Иван',
            email: 'ivan@mail.com',
            isActive: true
        });
    });

    it('createBook: должен создавать книгу ', () => {
        const book: Book = createBook({
            title: 'Война и мир',
            author: 'Лев Толстой',
            year: 1869,
            genre: 'fiction'
        });

        expect(book).toEqual({
            title: 'Война и мир',
            author: 'Лев Толстой',
            year: 1869,
            genre: 'fiction'
        });
    });

    it('calculateArea: должен вычислять площадь круга', () => {
        const area = calculateArea('circle', { radius: 5 });

        expect(area).toBeCloseTo(78.53981633974483, 5);
    });

    it('calculateArea: должен вычислять площадь квадрата', () => {
        const area = calculateArea('square', { side: 4 });

        expect(area).toBe(16);
    });

    it('getStatusColor: должен возвращать green для active статуса', () => {
        const color = getStatusColor('active');

        expect(color).toBe('green');
    });

    it('UpperFirst: должен делать первую букву заглавной', () => {
        const result = UpperFirst('hello world');

        expect(result).toBe('Hello world');
    });

    it('TrimStr: должен удалять пробелы по краям строки', () => {
        const result = TrimStr('  hello  ');

        expect(result).toBe('hello');
    });

    it('getFirstElement: должен возвращать первый элемент массива', () => {
        const arr = [10, 20, 30];
        const result = getFirstElement(arr);

        expect(result).toBe(10);
    });

    it('findById: должен находить пользователя по id', () => {
        const users: User1[] = [
            { id: 1, name: 'Иван', email: 'ivan@mail.com' },
            { id: 2, name: 'Мария', email: 'maria@mail.com' }
        ];

        const result = findById(users, 2);

        expect(result).toEqual({ id: 2, name: 'Мария', email: 'maria@mail.com' });
    });

});