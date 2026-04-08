export interface IState {
    _id: string;
    name: string;

}

export interface ICity {
    _id: string;
    name: string;
    stateId: IState;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICityCreate {
    name: string;
    stateId: string;
}

export interface ICityUpdate {
    name?: string;
    stateId?: string;
    isActive?: boolean;
    isDeleted?: boolean;
}

export interface CityInitialState {
    cities: ICity[];
    singleCity: ICity | null;
    cityLoading: boolean;
    cityError: string | null;
}