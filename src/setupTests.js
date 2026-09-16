import '@testing-library/jest-dom';
import React from 'react';

// Mock HTMLMediaElement methods for Jest/JSDOM
window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.addTextTrack = () => {};

// Mock react-chartjs-2 for test environments without HTML5 Canvas engine
jest.mock('react-chartjs-2', () => ({
    Radar: ({ data, options }) => <div data-testid="mock-radar" data-chart-data={JSON.stringify(data)} />,
}));
