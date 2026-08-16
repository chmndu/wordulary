export function formatTermType(termType: string) {
    return termType
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}