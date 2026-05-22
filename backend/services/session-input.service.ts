type SessionTextSource = string | null | undefined;

export function normalizeSessionText(value: SessionTextSource): string {
	if (typeof value !== 'string') return '';
	return value
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.replace(/\r\n/g, '\n')
		.replace(/[\t ]+/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export function tokenizeSessionText(value: string): string[] {
	return value
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter(Boolean);
}

export function isLikelyMeaningfulSessionText(value: string, options?: { minLength?: number; minWords?: number }) {
	const minLength = options?.minLength ?? 40;
	const minWords = options?.minWords ?? 6;
	const tokens = tokenizeSessionText(value);
	const uniqueTokens = new Set(tokens);
	const alphaChars = value.replace(/[^a-zA-Z]/g, '').length;
	const alphaRatio = value.length === 0 ? 0 : alphaChars / value.length;

	if (value.length < minLength) return false;
	if (tokens.length < minWords) return false;
	if (uniqueTokens.size < Math.min(4, tokens.length)) return false;
	if (alphaRatio < 0.45) return false;

	const counts = new Map<string, number>();
	for (const token of tokens) {
		counts.set(token, (counts.get(token) || 0) + 1);
	}
	const maxCount = Math.max(...counts.values(), 0);
	if (tokens.length >= 8 && maxCount / tokens.length > 0.5) return false;

	return true;
}

export function qualityLabel(value: string) {
	const tokens = tokenizeSessionText(value);
	return `${value.length} chars | ${tokens.length} words | ${new Set(tokens).size} unique`;
}
