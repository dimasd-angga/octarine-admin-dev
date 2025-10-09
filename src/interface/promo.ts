export interface IPromo {
    id?: number;
    title: string;
    url: string;
    description: string;
    enabled: boolean;
    popup: boolean;
    runningText: boolean;
    startDate: string; 
    endDate: string; 
    image: File | null; 
  }