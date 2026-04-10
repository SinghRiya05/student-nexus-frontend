
export interface ICountry {
    _id: string;
    name: string;
    code: string;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateCountry {
    name: string;
    code: string;
    isActive?: boolean;
}

export interface IUpdateCountry {
    id: string;
    data: ICreateCountry;
    isActive?: boolean;
}

export interface ICountryResponse {
    success: boolean;
    message: string;
    data: ICountry
}

export interface ICountryListResponse {
    success: boolean;
    message: string;
    data: ICountry[]
}

export interface CountryInitialState {
    countries: ICountry[];
    singleCountry: ICountry | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}