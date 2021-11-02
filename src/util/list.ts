export function range(size: number): Generator<number>;
export function range(start: number, end: number): Generator<number>;
export function* range(startOrSize: number, maybeEnd?: number | undefined): Generator<number> {
  const [start, end] = maybeEnd == null ? [0, startOrSize] : [startOrSize, maybeEnd];
  for (let i = start; i < end; i++) {
    yield i;
  }
}
