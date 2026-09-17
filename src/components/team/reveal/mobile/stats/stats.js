import React, { useState } from "react";
import './stats.styles.scss';
import Radar from "./radar/radar";
import { getStatPercentage } from "../../../../../services/pokemonService";

export const STAT_DEFINITIONS = [
    { key: 'hp', label: 'HP', name: 'Hit Points', colorClass: 'hp' },
    { key: 'attack', label: 'ATK', name: 'Attack', colorClass: 'attack' },
    { key: 'defense', label: 'DEF', name: 'Defense', colorClass: 'defense' },
    { key: 'spAttack', label: 'SP.ATK', name: 'Special Attack', colorClass: 'spAttack' },
    { key: 'spDefense', label: 'SP.DEF', name: 'Special Defense', colorClass: 'spDefense' },
    { key: 'speed', label: 'SPD', name: 'Speed', colorClass: 'speed' },
];

export const Stats = ({ stats }) => {
    const [activeTab, setActiveTab] = useState('bars');

    if (!stats) return null;

    const hp = stats.hp || 0;
    const attack = stats.attack || 0;
    const defense = stats.defense || 0;
    const spAttack = stats.spAttack || 0;
    const spDefense = stats.spDefense || 0;
    const speed = stats.speed || 0;

    const total = hp + attack + defense + spAttack + spDefense + speed;

    const setTab = (e, type) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveTab(type);
    }

    const statRows = STAT_DEFINITIONS.map((def) => {
        const val = stats[def.key] || 0;
        const percentage = getStatPercentage(def.key, val);
        return {
            ...def,
            value: val,
            percentage,
        };
    });

    return (
        <div className='stats pokemon-stats'>
            <div className="pokemon-stats__container">
                <div className="pokemon-stats__header">
                    <div className="pokemon-stats__title-wrap">
                        <span className="pokemon-stats__badge-icon" aria-hidden="true">⚡</span>
                        <span className="pokemon-stats__title">BASE STATS</span>
                        <span className="pokemon-stats__bst-pill" title="Base Stat Total">
                            BST <strong className="pokemon-stats__bst-value">{total}</strong>
                        </span>
                    </div>
                    <div className="pokemon-stats__toggle" role="tablist" aria-label="Stats display mode">
                        <button
                            type="button"
                            className={`pokemon-stats__tab-btn ${activeTab === 'bars' ? 'pokemon-stats__tab-btn--active' : ''}`}
                            onClick={(e) => setTab(e, 'bars')}
                            role="tab"
                            aria-selected={activeTab === 'bars'}
                        >
                            Bars
                        </button>
                        <button
                            type="button"
                            className={`pokemon-stats__tab-btn ${activeTab === 'radar' ? 'pokemon-stats__tab-btn--active' : ''}`}
                            onClick={(e) => setTab(e, 'radar')}
                            role="tab"
                            aria-selected={activeTab === 'radar'}
                        >
                            Radar
                        </button>
                    </div>
                </div>

                <div className={`pokemon-stats__view pokemon-stats__view--bars ${activeTab !== 'bars' ? 'pokemon-stats__view--hidden' : ''}`}>
                    <div className="pokemon-stats__bars-list">
                        {statRows.map(({ key, label, name, value, percentage, colorClass }) => (
                            <div
                                key={key}
                                className={`pokemon-stats__row pokemon-stats__row--${colorClass}`}
                                data-stat={key}
                            >
                                <div className="pokemon-stats__label-col">
                                    <span className="pokemon-stats__stat-badge" title={name}>
                                        {label}
                                    </span>
                                </div>
                                <div className="pokemon-stats__value-col">
                                    <span className="pokemon-stats__stat-value">{value}</span>
                                </div>
                                <div className="pokemon-stats__track-col">
                                    <div className="pokemon-stats__track">
                                        <div
                                            className="pokemon-stats__fill"
                                            style={{ width: `${Math.min(100, Math.max(percentage, 5))}%` }}
                                            title={`${name}: ${value}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pokemon-stats__footer">
                        <span className="pokemon-stats__footer-label">BASE STAT TOTAL</span>
                        <span className="pokemon-stats__footer-value">{total}</span>
                    </div>
                </div>

                <div className={`pokemon-stats__view pokemon-stats__view--radar ${activeTab !== 'radar' ? 'pokemon-stats__view--hidden' : ''}`}>
                    <Radar stats={stats} />
                </div>
            </div>
        </div>
    );
};

export default Stats;