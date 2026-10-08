import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Conversation from '../conversation/Conversation';
import Experiments from './Experiments';
import MascotExperiment from './MascotExperiment';
import App from '../../App';
import { matchTopic } from '../conversation/content';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.matchMedia = jest.fn(() => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
});
afterEach(() => window.history.replaceState({}, '', '/'));

test('cards distinguish playable and local-only projects', () => {
  render(<Experiments />);
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(screen.getAllByRole('button', { name: /Explore demo/ })).toHaveLength(3);
  expect(screen.getByRole('button', { name: /View project/ })).toBeInTheDocument();
  expect(screen.getByText('Local project · no live demo')).toBeInTheDocument();
  expect(screen.queryByText('Example')).not.toBeInTheDocument();
});

test.each(['/experiments', '/experiments/'])('direct index route %s opens a prepared reply with the composer', pathname => {
  window.history.replaceState({}, '', pathname);
  render(<Conversation />);
  expect(screen.getByRole('heading', { name: 'Small ideas. Room to play.' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Experiments' })).toHaveAttribute('aria-current', 'true');
  expect(screen.getByRole('textbox')).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', { name: /Explore demo/ })[0]);
  expect(window.location.pathname).toBe('/experiments/pixel-pong');
  expect(screen.getByTitle('Pixel Pong live experiment')).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Explore portfolio' })).getByRole('button', { name: 'About Usama' }));
  expect(window.location.pathname).toBe('/');
  expect(screen.getByRole('textbox')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'A little about Usama.' })).toBeInTheDocument();
  expect(within(document.querySelector('.about-photo')).getByRole('button', { name: 'Say hello to Usama' })).toBeInTheDocument();
  expect(document.querySelector('.reply-author .reply-avatar')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'View full-size photo of Usama Hassan' })).not.toBeInTheDocument();
  window.history.replaceState({}, '', pathname);
  fireEvent.popState(window);
  expect(screen.getByRole('heading', { name: 'Small ideas. Room to play.' })).toBeInTheDocument();
});

test('direct experiment link opens its detail in the conversation', () => {
  window.history.replaceState({}, '', '/experiments/linkedin-companion');
  render(<Conversation />);
  expect(screen.getByRole('heading', { name: 'LinkedIn Companion' })).toBeInTheDocument();
  expect(screen.getByText('Local project · no live demo')).toBeInTheDocument();
  expect(screen.queryByRole('iframe')).toBeNull();
});

test('Meet Usama responds to a click and is recognized as an experiment', () => {
  expect(matchTopic('Meet Usama')).toBe('experiment:meet-usama');
  render(<MascotExperiment />);
  expect(screen.getByRole('heading', { name: 'iamus4ma' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Say hello to Usama' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Say hello to Usama' }));
  expect(screen.getByRole('button', { name: 'Say hello to Usama' })).toBeInTheDocument();
});

test('LinkedIn Companion has a source page without a live demo', () => {
  render(<Experiments pathname="/experiments/linkedin-companion" />);
  expect(screen.getByRole('heading', { name: 'LinkedIn Companion' })).toBeInTheDocument();
  expect(screen.getByText('Local project · no live demo')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View source and setup/ })).toHaveAttribute('href', 'https://github.com/iamus4ma/linkedin-companion');
  expect(screen.queryByRole('iframe')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Open full page/ })).not.toBeInTheDocument();
});

test('unknown experiments give a useful way back', () => {
  render(<Experiments pathname="/experiments/not-real" />);
  expect(screen.getByRole('heading', { name: 'Experiment not found' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Explore all experiments/ })).toBeInTheDocument();
});

test('Pixel Pong embeds the game inside its portfolio route', () => {
  render(<Experiments pathname="/experiments/pixel-pong" />);
  expect(screen.getByRole('heading', { name: 'Pixel Pong' })).toBeInTheDocument();
  expect(screen.getByTitle('Pixel Pong live experiment')).toHaveAttribute('src', 'https://pixel-pong-six.vercel.app');
  expect(screen.getByRole('link', { name: /Open full page/ })).toHaveAttribute('href', '/experiments/pixel-pong/fullscreen');
  expect(screen.queryByRole('link', { name: /Open live experiment/ })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/iamus4ma/pixel-pong-game');
});

test('full-page route keeps the game on the portfolio domain without the portfolio shell', () => {
  window.history.replaceState({}, '', '/experiments/pixel-pong/fullscreen');
  render(<App />);
  expect(screen.getByTitle('Pixel Pong live experiment')).toHaveAttribute('src', 'https://pixel-pong-six.vercel.app');
  expect(screen.queryByRole('navigation', { name: 'Explore portfolio' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to Pixel Pong in the portfolio' })).toHaveAttribute('href', '/experiments/pixel-pong');
});
