import { readFile, writeFile } from 'fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (!input || input.length === 0) {
        throw new Error("Входной массив не может быть пустым");
    }

    if (!delimiter || delimiter.length === 0) {
        throw new Error("Разделитель не может быть пустым");
    }

    const headerRow = input[0];
    if (!headerRow) {
        throw new Error("Первая строка не может быть пустой");
    }

    const headers = headerRow.split(delimiter);

    if (headers.length === 0) {
        throw new Error("Заголовки не могут быть пустыми");
    }

    const result: object[] = [];

    for (let i = 1; i < input.length; i++) {
        const row = input[i];

        if (!row) {
            continue;
        }

        if (row.trim() === "") {
            continue;
        }

        const values = row.split(delimiter);

        if (values.length !== headers.length) {
            throw new Error(
                `Несоответствие количества полей в строке ${i + 1}: ` +
                `ожидалось ${headers.length}, получено ${values.length}`,
            );
        }

        const obj: Record<string, any> = {};

        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            if (!header) {
                continue;
            }

            const value = values[j];

            let processedValue: any = value !== undefined ? value : "";

            if (typeof processedValue === "string") {
                if (/^\d+$/.test(processedValue)) {
                    processedValue = parseInt(processedValue, 10);
                } else if (/^\d+\.\d+$/.test(processedValue)) {
                    processedValue = parseFloat(processedValue);
                }
            }

            obj[header] = processedValue;
        }

        result.push(obj);
    }

    return result;
}
export async function formatCSVFileToJSONFile(
    input: string,
    output: string,
    delimiter: string,
): Promise<void> {
    try {
        const fileContent = await readFile(input, "utf-8");

        if (!fileContent) {
            throw new Error("Файл пуст");
        }

        const lines = fileContent
            .split("\n")
            .filter((line) => line && line.trim() !== "");

        if (lines.length === 0) {
            throw new Error("Файл не содержит данных");
        }

        const jsonData = csvToJSON(lines, delimiter);

        await writeFile(output, JSON.stringify(jsonData, null, 2), "utf-8");
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Ошибка при обработке файла: ${error.message}`);
        }
        throw error;
    }
}