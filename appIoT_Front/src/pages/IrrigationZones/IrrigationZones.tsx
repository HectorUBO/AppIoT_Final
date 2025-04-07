import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import IrrigationMap from "../../components/Maps/IrrigationMap";
import ZoneList from "../../components/ZoneList/ZoneList";
import ZonesStatusChart from "../../components/Charts/ZoneChart/ZoneChart";
import "./IrrigationZones.css";

function IrrigationZones() {
    const mapboxToken = "pk.eyJ1IjoiaGVjdG9yYmFvIiwiYSI6ImNtNGRjbzZhcTBobm4ya3B5cGg0bHNmMTcifQ.PQ3zQrL4FlfNZdiSX7bMnA";

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="irrigation-layout">
                    <div className="map-wrapper">
                        <IrrigationMap accessToken={mapboxToken} />
                    </div>
                    <div className="zones-list-wrapper">
                        <ZoneList />
                    </div>
                </div>
                <div className="zones-chart-wrapper">
                    <ZonesStatusChart />
                </div>
            </div>

        </div>
    );
}

export default IrrigationZones;