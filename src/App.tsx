import React, { useState, useEffect } from "react";

// Tipos para as localizações
interface Location {
  latitude: number;
  longitude: number;
}

// Localização da Biblioteca
const allowedLocation: Location = {
  latitude: -23.4439796613,
  longitude: -46.5015942131,
};

// Distância máxima permitida em metros
const maxDistance = 300;

// Função para calcular a distância entre dois pontos geográficos (latitude, longitude)
const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Raio da Terra em metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em metros
};

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null); // Localização do usuário
  const [distance, setDistance] = useState<number | null>(null); // Distância calculada
  const [isWithinRange, setIsWithinRange] = useState<boolean>(false); // Se está dentro do raio permitido

  useEffect(() => {
    if (navigator.geolocation) {
      // Obtendo a localização do usuário
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Calculando a distância entre a biblioteca e o usuário
        const calculatedDistance = getDistanceFromLatLonInMeters(
          allowedLocation.latitude,
          allowedLocation.longitude,
          latitude,
          longitude
        );
        setDistance(calculatedDistance);

        // Verificando se o usuário está dentro do raio permitido
        setIsWithinRange(calculatedDistance <= maxDistance);
      });
    } else {
      alert("Geolocalização não é suportada neste navegador.");
    }
  }, []);

  return (
    <div className="App">
      <h1>Verificando Distância</h1>
      {userLocation ? (
        <>
          <p>
            <strong>Localização da Biblioteca:</strong>
          </p>
          <p>Latitude: {allowedLocation.latitude}</p>
          <p>Longitude: {allowedLocation.longitude}</p>

          <p>
            <strong>Localização do Usuário:</strong>
          </p>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>

          <p>
            <strong>Distância até a Biblioteca:</strong> {distance?.toFixed(2)}{" "}
            metros
          </p>

          {isWithinRange ? (
            <p>Você está dentro da área permitida!</p>
          ) : (
            <p>Você está fora da área permitida.</p>
          )}
        </>
      ) : (
        <p>Obtendo sua localização...</p>
      )}
    </div>
  );
};

export default App;
