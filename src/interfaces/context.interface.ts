export interface Icontext{
    req: IRequest;
    connection: IConnection;
}

interface IRequest{
    headers:{
        authorization: string;
    };
}

interface IConnection{
    authorization: string;
}