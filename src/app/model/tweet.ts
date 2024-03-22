export type tweet = {
  id?: string;
  title: string;
  description: string;
  image: string | ArrayBuffer;
  date: { seconds: number; nanoseconds: number } | Date;
};
