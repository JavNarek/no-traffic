export interface Points extends Array<[number,number]>{
  0: [number, number];
  1: [number, number];
  2: [number, number];
  3: [number, number];
}

export interface ZoneModel {
  id?: number;
  name: string;
  point: Points;
}
