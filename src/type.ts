export interface Group<T, K extends keyof T> {
    readonly key: T[K];
    items: T[];
}

export type Transform<T, R = T> = (data: T[]) => R[];

export type Where = <T = any, K extends keyof T = keyof T>(
    property: K,
    target: T[K]
) => Transform<T>;

export type Sort = <T = any, K extends keyof T = keyof T>(
    field: K
) => Transform<T>;

export type GroupBy = <T = any, K extends keyof T = keyof T>(
    key: K
) => (input: T[]) => Group<T, K>[];

export type GroupTransform<T, K extends keyof T> = (
    collection: Group<T, K>[]
) => Group<T, K>[];

export type Having = <T = any, K extends keyof T = keyof T>(
    match: (item: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export const where: Where = (property, target) => (collection: any[]) =>
    collection.filter((obj) => obj[property] === target);

export const sort: Sort = (field) => (collection: any[]) => {
    return collection.slice().sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA === valB) return 0;
        return valA > valB ? 1 : -1;
    });
};

export const groupBy: GroupBy = (field) => (items: any[]) => {
    const storage: Record<string, Group<any, any>> = {};

    for (const item of items) {
        const val = item[field];
        const stringKey = String(val);

        if (!storage[stringKey]) {
            storage[stringKey] = { key: val, items: [] };
        }
        storage[stringKey].items.push(item);
    }

    return Object.values(storage);
};

export const having: Having = (match) => (groupList: any[]) =>
    groupList.filter((g) => match(g));

export function query<TIn, TOut = TIn>(
    ...steps: Array<(data: any) => any>
): (data: TIn[]) => TOut[] {
    return (initialData: TIn[]) => {
        return steps.reduce((acc, step) => step(acc), initialData as any);
    };
}