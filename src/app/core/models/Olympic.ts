import { Participation } from "./Participation";

export interface OlympicsData {
            id: number,
            country: string,
            participations: Participation[]
           ;


    
}
        
export interface ChartOlympicsData {
    name: string;
    value: number;
    extra: {
        id: number;
        country: string;
        participations: Participation[];
    }
}

