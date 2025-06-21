// components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ lat = 19.0760, lng = 72.8777 }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          Selected Location
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
