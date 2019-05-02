import { ADD_COORDINATE } from './actionTypes'

let nextPlaceId = 0
export const addCoordinateAC = coordinates => ({
    type: ADD_COORDINATE,
    payload: {
        id: ++nextPlaceId,
        coordinates: coordinates,
    }
})

async function getAPIKey() {
    let res = await fetch('/key');
    let APIKey = res.text()
    return APIKey;
}

export const fetchCoordinatesAC = (adress) => {
    return async (dispatch) => {
        const APIkey = await getAPIKey();
        let res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${APIkey}&format=json&geocode=Москва ${adress}`)
        let data = await res.json();
        let coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        coordinates = coordinates.split(' ')
        let long = Number(coordinates[0]);
        let lat = Number(coordinates[1])
        let arrayWithCoordinates = [lat, long];
        dispatch(addCoordinateAC(arrayWithCoordinates));
    }
}