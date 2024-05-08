export interface GismeteoBodyDTO {
    date: {
        local: string;
        UTC: string;
    },
    temperature: {
        comfort: {
            C: number;
            F: number;
        },
        air: {
            C: number;
            F: number;
        },
        water: {
            C: number;
            F: number;
        }
    },
    description: {
        full: string;
    },
    icon: string;
}

export interface GismeteoCityBodyDTO {
    total: number;
    items: GismeteoCityDTO[]
}

export interface GismeteoCityDTO {
    id: number;
}

export interface TodayWeatherBodyDTO {
    directionID: number;
    date: string;
}

export interface DirectionWeatherBodyDTO {
    directionID: number;
}

export interface GismeteoENVDTO {
    lang: string;
    key: string;
    days: number;
}