export function getTrimmedText(sample: string, limit: number) {
  if (sample.length > limit) return sample.substr(0, limit) + '...';
  return sample;
}
