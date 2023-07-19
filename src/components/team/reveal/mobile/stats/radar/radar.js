import React, {useCallback, useEffect, useState} from "react";
import { Radar as RadarComponent } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import pokemons from "../../../../../../resources/pokemons.json";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const Radar = ({stats: {hp, attack, defense, speed, spDefense, spAttack}}) => {
    const [data, setData] = useState(undefined);
    const [options] = useState({
        scales: {
            r: {
                pointLabels: {
                    color: '#9EADE6',
                    font: 'bold'
                },
                ticks: {
                    display: false
                }
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    });
    const getMaxStat = key => pokemons.reduce((max, {base}) => base[key] > max ? base[key] : max, 0);
    const getPercentage = useCallback((key, val) => val / getMaxStat(key) * 100, []);

    useEffect(() => {
        const pokemonData = [
            getPercentage('hp', hp),
            getPercentage('attack', attack),
            getPercentage('defense', defense),
            getPercentage('speed', speed),
            getPercentage('spDefense', spDefense),
            getPercentage('spAttack', spAttack)
        ];
        const maxData = [100, 100, 100, 100, 100, 100]

        const maxLeft = [100, 0, 0, 100, 100, 100];
        const maxRight = [100, 100, 100, 100, 0, 0];

        const midLeft = [75, 0, 0, 75, 75, 75];
        const midRight = [75, 75, 75, 75, 0, 0];

        const minLeft = [50, 0, 0, 50, 50, 50];
        const minRight = [50, 50, 50, 50, 0, 0];
        setData({
            labels: ['HP', 'Attack', 'Defense', 'Speed', 'Sp.Def', 'Sp.Atk'],
            datasets: [
                {
                    label: '',
                    data: pokemonData,
                    backgroundColor: 'rgba(1,115,227,0.6)',
                    borderColor: 'rgba(1,115,227, 1)',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: minLeft,
                    backgroundColor: '#04FC8A',
                    borderColor: '#FFF',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: minRight,
                    backgroundColor: '#00FF85',
                    borderColor: '#FFF',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: midLeft,
                    backgroundColor: '#CDFF9E',
                    borderColor: '#CDFF9E',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: midRight,
                    backgroundColor: '#B6F08C',
                    borderColor: '#B6F08C',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: maxLeft,
                    backgroundColor: '#E0FEBE',
                    borderColor: '#E0FEBE',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: maxRight,
                    backgroundColor: '#CBF1A8',
                    borderColor: '#CBF1A8',
                    borderWidth: 1,
                },
                {
                    label: '',
                    data: maxData,
                    backgroundColor: 'white',
                    borderColor: 'white',
                    borderWidth: 1,
                }
            ],
        })
    }, [attack, defense, hp, spAttack, spDefense, speed, getPercentage]);
    return (
        <div>
            { data && <RadarComponent data={data} options={options} type='radar'/> }
        </div>
    );
};

export default Radar;