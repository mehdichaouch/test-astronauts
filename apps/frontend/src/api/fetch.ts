import { AstronautInternalError } from "@space/core/astronaut.error.js";

export function fetchApi(path: string, init: RequestInit = {}): Promise<Response> {
    const requestInit = {
        ...init,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
          },
    } satisfies RequestInit

    return fetch(`${import.meta.env['VITE_API_URL']}/${path}`, requestInit)
}

export function koResponseToError(response: Response): Response {
    if(!response.ok) {
        throw new AstronautInternalError(`Failed to execute request`)
    };

    return response;
}