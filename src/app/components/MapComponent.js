'use client';

import { useState } from 'react';
// IMPORTANT: import from 'react-map-gl/mapbox' since you're on mapbox-gl >= 3.5
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import { MapPin, Heart, Star } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapComponent({ places, onPlaceClick, favorites, onToggleFavorite }) {
  const [popupInfo, setPopupInfo] = useState(null);

  // Use "viewState" for v8
  const [viewState, setViewState] = useState({
    latitude: places[0]?.latitude || 40.416775,
    longitude: places[0]?.longitude || -3.703790,
    zoom: 13
  });

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)} // in v8, use evt.viewState
      style={{ width: '100%', height: 'calc(100vh - 200px)' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          latitude={place.latitude}
          longitude={place.longitude}
          anchor="bottom"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPopupInfo(place);
            }}
            className="relative group"
          >
            <div className="absolute -top-2 -right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(place.id);
                }}
                className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  size={14}
                  className={
                    favorites.has(place.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600'
                  }
                />
              </button>
            </div>
            <div className="bg-white p-2 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <MapPin className="text-indigo-600" />
            </div>
          </button>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          className="rounded-xl overflow-hidden"
        >
          <div className="p-2 min-w-[200px]">
            <img
              src={popupInfo.image}
              alt={popupInfo.name}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="font-semibold text-gray-800">{popupInfo.name}</h3>
            <div className="flex items-center mt-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-gray-600 text-sm ml-1">
                {popupInfo.rating}
              </span>
              <span className="text-gray-400 text-sm ml-1">
                ({popupInfo.reviews})
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">{popupInfo.address}</div>
            <button
              onClick={() => onPlaceClick(popupInfo)}
              className="mt-2 w-full bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Ver detalles
            </button>
          </div>
        </Popup>
      )}
    </Map>
  );
}
