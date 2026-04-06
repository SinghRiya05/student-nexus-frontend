interface ICountry {
    _id: string;
    name: string;
    code: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IState {
    _id: string;
    name: string;
    countryId: ICountry;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IStateApiResponse {
    success: boolean;
    message: string;
    data: IState[];
}

export interface IStateCreate {
    name: string;
    country: string;
}

export interface IStateUpdate {
    name?: string;
    country?: string;
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface StateInitialState {
    states: IState[];
    singleState: IState | null;
    stateLoading: boolean;
    stateError: string | null;
}