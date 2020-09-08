export async function GET(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity);

    return await req.json();
}

export async function PUT(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}

export async function PATCH(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}

export async function POST(entity: string, data: object = {}) {
    const req = await fetch(process.env.REACT_APP_SERVER_URL + '/' + entity, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });

    if (!req.ok) {
        throw new Error(await req.json());
    }

    return await req.json();
}
