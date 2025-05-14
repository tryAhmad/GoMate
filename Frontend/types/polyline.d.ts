declare module "@mapbox/polyline" {
  const polyline: {
    decode: (str: string) => [number, number][];
    encode: (coords: [number, number][]) => string;
  };
  export default polyline;
}
