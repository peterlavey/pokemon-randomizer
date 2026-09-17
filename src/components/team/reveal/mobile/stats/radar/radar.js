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
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        r: {
            suggestedMin: 0,
            suggestedMax: 100,
            angleLines: {
                color: 'rgba(255, 255, 255, 0.12)',
                lineWidth: 1
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.08)',
                circular: true
            },
            pointLabels: {
                color: '#e2e8f0',
                font: {
                    size: 11,
                    weight: 'bold',
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                },
                padding: 6
            },
            ticks: {
                display: false,
                stepSize: 25,
                maxTicksLimit: 5
            }
        }
    },
    elements: {
        line: {
            tension: 0.1
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#38bdf8',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 8,
            displayColors: false,
            callbacks: {
                label: (context) => ` ${context.label}: ${Math.round(context.raw)}%`
            }
        }
    }
};

const fixedDatasets = [
    {
        label: '',
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        pointRadius: 0
    },
    {
        label: '',
        data: [75, 75, 75, 75, 75, 75],
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        pointRadius: 0
    },
    {
        label: '',
        data: [50, 50, 50, 50, 50, 50],
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        pointRadius: 0
    },
    {
        label: '',
        data: [25, 25, 25, 25, 25, 25],
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 1,
        pointRadius: 0
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
                    label: 'Stats',
                    data: pokemonData,
                    backgroundColor: 'rgba(56, 189, 248, 0.45)',
                    borderColor: '#38bdf8',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#0284c7',
                    pointBorderWidth: 1.5,
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                ...fixedDatasets,
            ],
        };
    }, [hp, attack, defense, speed, spDefense, spAttack]);

    if (!stats) return null;

    return (
        <div className="radar-container">
            <RadarComponent data={chartData} options={chartOptions} type='radar' />
        </div>
    );
};

export default Radar;
