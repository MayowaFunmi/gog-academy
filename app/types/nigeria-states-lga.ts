declare module 'nigeria-states-lgas' {
  export interface State {
    name: string;
    lgas: string[]
  }

  export const states: State[]
}