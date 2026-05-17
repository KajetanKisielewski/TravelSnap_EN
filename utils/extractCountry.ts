export function extractCountry(
  destination: string
): string {
  const parts =
    destination
      .split(',')
      .map((part) =>
        part.trim()
      );

  return (
    parts[
      parts.length - 1
    ] || destination
  );
}