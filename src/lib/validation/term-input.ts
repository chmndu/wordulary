export function validateTermInput(
    value: string
): string | null {
    const term = value.trim();

    if (!term) {
        return "Term is required.";
    }

    if (!/[A-Za-z]/.test(term)) {
        return "Term must contain at least one letter.";
    }

    return null;
}