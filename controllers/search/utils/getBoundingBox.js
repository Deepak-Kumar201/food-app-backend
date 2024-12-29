import geolib from 'geolib'

const calculateBoundingBox = (lat, lon, distanceKm) => {
    const boundingBox = geolib.getBoundsOfDistance(
        { latitude: lat, longitude: lon },
        distanceKm * 1000
    );

    return {
        latitudeMin: Number.parseInt(boundingBox[0].latitude * 500),
        latitudeMax: Math.ceil(boundingBox[1].latitude * 500),
        longitudeMin: boundingBox[0].longitude.toFixed(6),
        longitudeMax: boundingBox[1].longitude.toFixed(6)
    };
};

export default calculateBoundingBox;