import TLDR from "../TLDR";
import styles from "../../styles/Tasks.module.css";
import Map from "../../config/Map";
import {Layer, Source} from "react-map-gl";
import React, {useEffect, useState} from "react";
import Image from "next/image";

const getStationsWithAvailability = async (stations) => {
    // TODO: Implement
};

const createGeoJson = (stations) => {
    const features = Object.values(stations).map((station) => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [station.lon, station.lat],
        },
        properties: {
            title: station.address,
            free: station.availability.num_bikes_available,
            capacity: station.capacity,
        },
    }));

    const data = {
        type: "FeatureCollection",
        features: features,
    };

    return data;
};

const Task7 = ({stations}) => {
    const [stationsWithAvailability, setStationsWithAvailability] =
        useState(null);

    useEffect(() => {
        const updateAvailability = async () => {
            setStationsWithAvailability(await getStationsWithAvailability(stations));
        };
        updateAvailability();
        let intervalId = setInterval(() => {
            updateAvailability();
        }, 60 * 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div>
            <TLDR>
                <p>
                    <b>Kort fortalt: </b>
                    Flett sammen dataen fra stasjonsapi-et til bysykkel med
                    tilgjengelighetsapi-et. Implementer{" "}
                    <code>getStationsWithAvailability</code> i task7.js.
                </p>
            </TLDR>
            <Map>
                {stationsWithAvailability && (
                    <Source
                        type="geojson"
                        data={createGeoJson(stationsWithAvailability)}
                        cluster={false}
                        clusterRadius={10}
                    >
                        <Layer
                            id="free-2"
                            type="circle"
                            layout={{}}
                            paint={{
                                "circle-color": {
                                    property: "free",
                                    stops: [
                                        [0, "#cc3232"],
                                        [1, "#e7b416"],
                                        [5, "#e7b416"],
                                        [6, "green"],
                                    ],
                                },
                                "circle-radius": [
                                    "interpolate",
                                    ["exponential", 2],
                                    ["zoom"],
                                    8,
                                    1,
                                    12.5,
                                    8,
                                ],
                            }}
                        />
                        <Layer
                            id="free"
                            type="symbol"
                            layout={{
                                "text-field": ["get", "free"],
                                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                                "text-size": [
                                    "interpolate",
                                    ["exponential", 2],
                                    ["zoom"],
                                    8,
                                    1,
                                    12.5,
                                    9,
                                ],
                                visibility: "visible",
                                "text-allow-overlap": true,
                            }}
                            paint={{
                                "text-color": "white",
                                "text-opacity": 1.0,
                            }}
                        />
                    </Source>
                )}
            </Map>
            <br/>
            <p className={styles.section}>
                I tidligere oppgaver har vi sett p?? ?? hente ut data med axios og ??
                formatere det p?? en spesiell m??te. N?? skal vi ta dette videre et niv?? og
                hente ut tilgjengelighetsdataen fra bysykkel sitt sanntidsapi og vise
                det direkte i et kart.
                <br/>
                <br/>
                Tilgjengelighetsapi-et til bysykkel finnes p??{" "}
                <code>
                    https://gbfs.urbansharing.com/bergenbysykkel.no/station_status.json
                </code>
                <br/>
                <a href="https://bergenbysykkel.no/apne-data/sanntid">
                    Dokumentasjon p?? api-et finner du her!
                </a>
                <br/>
                Api-et inneholder en liste med informasjon om hvor mange sykler der er
                pr. stasjon. Se bildet under
                <Image
                    src="/images/tilgjengelighetRespons.png"
                    width={1000}
                    height={500}
                    className={styles.image}
                />
                Vi har beklageligvis ikke informasjon om e.g hvor stasjonen befinner seg
                og vi m?? derfor flette det sammen med stasjon-apiet som har v??rt brukt i
                tidligere oppgaver. Det er en felles faktor mellom dataen i disse to
                datasettene p??
                <code>station_id</code> og vi kan bruke dette til ?? flette sammen
                dataen.
                <br/>
                <br/>
                Du m?? selv hente ut informasjonen fra endepunktet i
                tilgjengelighetsapi-et og bruke det i sammenflettingen i{" "}
                <code>getStationsWithAvailability</code> i task7.js. (Et tips er ?? bruke
                reduce funksjonen i javascript.) N??r oppgaven er implementert ordentlig
                vil du kunne se p?? kartet over noe som ser ut som dette:
                <br/>
                <br/>
                <Image
                    src="/images/task7Complete.png"
                    width={1000}
                    height={700}
                    className={styles.image}
                />
                <br/>
                <br/>
                Der hver sirkel er en unik stasjon som viser hvor mange sykler som er
                tilgjengelige. Fargene er splittet opp hvor:
                <ul>
                    <li>R??d - Dersom ingen sykler igjen</li>
                    <li>Gul - Dersom det er opp til 5 sykler tilgjengelige</li>
                    <li>Gr??nn - Dersom der er mer enn 5 syker tilgjengelige</li>
                </ul>
            </p>

            <div className={styles.tasks}>
                <b>Oppgaver</b>
                <ul className={styles.listWithIconsPin}>
                    <li>
                        Flett sammen dataen fra stasjonsapi-et til bysykkel med
                        tilgjengelighetsapi-et. Implementer{" "}
                        <code>getStationsWithAvailability</code> i task7.js.
                    </li>
                    <li>
                        Tips: Her m?? man sl?? sammen data; dette gj??res ved ?? finne fellesnevnerene ved de to forskjellige
                        datasettene, for eksempel en ID og s?? bruke de to datapunktene til ?? lage et nytt datapunkt.

                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Task7;
