import React, { useMemo } from "react";
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
import { getStatPercentage } from "../../../../../../services/pokemonService";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const chartOptions = {
    scales: {
        r: {
            pointLabels: {
                color: '#9EADE6',
                font: {
                    weight: 'bold'
                }
            },
            ticks: {
                display: false
            }
        }
    },
    elements: {
        point: {
            radius: 0
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

const fixedDatasets = [
    {
        label: '',
        data: [50, 0, 0, 50, 50, 50],
        backgroundColor: '#04FC8A',
        borderColor: '#FFF',
        borderWidth: 1,
    },
    {
        label: '',
        data: [50, 50, 50, 50, 0, 0],
        backgroundColor: '#00FF85',
        borderColor: '#FFF',
        borderWidth: 1,
    },
    {
        label: '',
        data: [75, 0, 0, 75, 75, 75],
        backgroundColor: '#CDFF9E',
        borderColor: '#CDFF9E',
        borderWidth: 1,
    },
    {
        label: '',
        data: [75, 75, 75, 75, 0, 0],
        backgroundColor: '#B6F08C',
        borderColor: '#B6F08C',
        borderWidth: 1,
    },
    {
        label: '',
        data: [100, 0, 0, 100, 100, 100],
        backgroundColor: '#E0FEBE',
        borderColor: '#E0FEBE',
        borderWidth: 1,
    },
    {
        label: '',
        data: [100, 100, 100, 100, 0, 0],
        backgroundColor: '#CBF1A8',
        borderColor: '#CBF1A8',
        borderWidth: 1,
    },
    {
        label: '',
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
    }
];

export const Radar = ({ stats }) => {
    const {
        hp = 0,
        attack = 0,
        defense = 0,
        speed = 0,
        spDefense = 0,
        spAttack = 0
    } = stats || {};

    const chartData = useMemo(() => {
        const pokemonData = [
            getStatPercentage('hp', hp),
            getStatPercentage('attack', attack),
            getStatPercentage('defense', defense),
            getStatPercentage('speed', speed),
            getStatPercentage('spDefense', spDefense),
            getStatPercentage('spAttack', spAttack)
        ];

        return {
            labels: ['HP', 'Attack', 'Defense', 'Speed', 'Sp.Def', 'Sp.Atk'],
            datasets: [
                {
                    label: '',
                    data: pokemonData,
                    backgroundColor: 'rgba(1,115,227,0.6)',
                    borderColor: 'rgba(1,115,227, 1)',
                    borderWidth: 1,
                },
                ...fixedDatasets,
            ],
        };
    }, [hp, attack, defense, speed, spDefense, spAttack]);

    if (!stats) return null;

    return (
        <div>
            <RadarComponent data={chartData} options={chartOptions} type='radar' />
        </div>
    );
};

export default Radar;
