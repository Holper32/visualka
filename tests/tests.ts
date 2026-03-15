import { describe, test, expect } from 'vitest';
import { query, where, sort, groupBy, having } from '../src/type';
import { Group } from '../src/type';

type User = {
    id: number;
    name: string;
    surname: string;
    age: number;
    city: string;
};

const users: User[] = [
    { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
    { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
    { id: 3, name: "John", surname: "Smith", age: 35, city: "LA" },
    { id: 4, name: "Mike", surname: "Doe", age: 28, city: "LA" },
];

describe('Query Pipeline Labs', () => {

    test('1. Фильтрация и сортировка (where + sort)', () => {
        const search = query<User>(
            where("name", "John"),
            where("surname", "Doe"),
            sort("age")
        );

        const result = search(users);

        expect(result).toHaveLength(2);
        expect(result[0].age).toBe(33);
        expect(result[1].age).toBe(34);
    });

    test('2. Группировка и фильтрация групп (groupBy + having)', () => {
        const groupPipeline = query<User, Group<User, "city">>(
            groupBy("city"),
            having((g) => g.items.length > 1)
        );

        const result = groupPipeline(users);
        expect(result).toHaveLength(2);
        expect(result.map(g => g.key)).toContain("NY");
        expect(result.map(g => g.key)).toContain("LA");
    });

    test('3. Комбинированный конвейер', () => {
        const pipeline = query<User, any>(
            where("surname", "Doe"),
            groupBy("city"),
            having((g) => g.items.some(u => u.age > 30))
        );

        const result = pipeline(users);

        expect(result).toHaveLength(1);
        expect(result[0].key).toBe("NY");
    });

    test('4. Проверка на иммутабельность (sort не меняет оригинал)', () => {
        const originalCopy = [...users];
        const sortPipe = query<User>(sort("age"));

        sortPipe(users);
        expect(users[0].id).toBe(originalCopy[0].id);
    });

    test('5. Работа с пустым результатом', () => {
        const emptyPipe = query<User>(where("name", "NonExistent"));
        const result = emptyPipe(users);
        expect(result).toEqual([]);
    });

});