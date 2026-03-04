import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFile, writeFile } from "node:fs/promises";
import { csvToJSON, formatCSVFileToJSONFile } from "./function";

vi.mock("node:fs/promises", () => ({
    readFile: vi.fn(),
    writeFile: vi.fn(),
}));

describe("csvToJSON", () => {
    describe("корректные входные данные", () => {
        it("должен преобразовывать CSV с точкой с запятой в JSON", () => {
            const input = ["p1;p2;p3", "1;A;b", "2;B;v"];
            const result = csvToJSON(input, ";");

            expect(result).toEqual([
                { p1: 1, p2: "A", p3: "b" },
                { p1: 2, p2: "B", p3: "v" },
            ]);
        });

        it("должен преобразовывать числа в числовой тип", () => {
            const input = ["id;value", "1;42", "2;3.14"];
            const result = csvToJSON(input, ";");

            expect(result).toEqual([
                { id: 1, value: 42 },
                { id: 2, value: 3.14 },
            ]);
        });

        it("должен пропускать пустые строки", () => {
            const input = ["a;b", "1;2", "", "3;4"];
            const result = csvToJSON(input, ";");

            expect(result).toEqual([
                { a: 1, b: 2 },
                { a: 3, b: 4 },
            ]);
        });
    });

    describe("некорректные входные данные", () => {
        it("должен выбрасывать ошибку при пустом массиве", () => {
            expect(() => csvToJSON([], ";")).toThrow(
                "Входной массив не может быть пустым",
            );
        });

        it("должен выбрасывать ошибку при пустом разделителе", () => {
            expect(() => csvToJSON(["a;b"], "")).toThrow(
                "Разделитель не может быть пустым",
            );
        });

        it("должен выбрасывать ошибку при несоответствии количества полей", () => {
            const input = ["a;b;c", "1;2"];

            expect(() => csvToJSON(input, ";")).toThrow(
                "Несоответствие количества полей в строке 2: ожидалось 3, получено 2",
            );
        });
    });
});

describe("formatCSVFileToJSONFile", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("должен читать CSV файл и записывать JSON файл", async () => {
        const mockCSVContent = "name;age;city\nИван;25;Москва\nМария;30;СПб";
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);

        await formatCSVFileToJSONFile("input.csv", "output.json", ";");

        expect(readFile).toHaveBeenCalledWith("input.csv", "utf-8");
        expect(writeFile).toHaveBeenCalledWith(
            "output.json",
            JSON.stringify(
                [
                    { name: "Иван", age: 25, city: "Москва" },
                    { name: "Мария", age: 30, city: "СПб" },
                ],
                null,
                2,
            ),
            "utf-8",
        );
    });

    it("должен выбрасывать ошибку при пустом файле", async () => {
        vi.mocked(readFile).mockResolvedValue("");

        await expect(
            formatCSVFileToJSONFile("empty.csv", "output.json", ";"),
        ).rejects.toThrow("Ошибка при обработке файла: Файл пуст");
    });

    it("должен выбрасывать ошибку при некорректном CSV", async () => {
        const mockCSVContent = "name;age\nИван;25;Москва";
        vi.mocked(readFile).mockResolvedValue(mockCSVContent);

        await expect(
            formatCSVFileToJSONFile("bad.csv", "output.json", ";"),
        ).rejects.toThrow(
            "Ошибка при обработке файла: Несоответствие количества полей в строке 2: ожидалось 2, получено 3",
        );
    });

    it("должен обрабатывать ошибки чтения файла", async () => {
        vi.mocked(readFile).mockRejectedValue(new Error("Файл не найден"));

        await expect(
            formatCSVFileToJSONFile("missing.csv", "output.json", ";"),
        ).rejects.toThrow("Ошибка при обработке файла: Файл не найден");
    });
});