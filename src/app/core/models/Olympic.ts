import { Participation } from "./Participation";
//Interface pour les données des JO
export interface OlympicsData {
            id: number,
            country: string,
            participations: Participation[]
           ;


    
}
//Interface pour les données du graphique  
export interface ChartOlympicsData {
    name: string;
    value: number;
    extra: {
        id: number;
        country: string;
        participations: Participation[];
    }
}

