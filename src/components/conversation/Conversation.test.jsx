import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Conversation from './Conversation';
import { matchTopic, topics } from './content';

function setReducedMotion(reduced) {
  window.matchMedia = jest.fn(query => ({
    matches: query.includes('prefers-reduced-motion') && reduced,
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
  }));
}

beforeEach(() => { localStorage.clear(); setReducedMotion(true); });

test('shows the cursor-following mascot without click reactions in the welcome avatar', () => {
  render(<Conversation />);
  const avatar = document.querySelector('.welcome-avatar');
  expect(avatar.querySelector('.welcome-mascot')).toHaveAttribute('aria-hidden', 'true');
  expect(avatar.querySelectorAll('.mascot-sprite')).toHaveLength(1);
  expect(within(avatar).queryByRole('button')).not.toBeInTheDocument();
});

test.each(topics)('recognizes the prepared $id prompt', topic => {
  expect(matchTopic(topic.prompt)).toBe(topic.id);
});

test('reveals real projects and keeps the conversation when another topic is selected', () => {
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: /Show me Usama’s projects/ }));
  const log = screen.getByRole('log');
  expect(within(log).getByRole('heading', { name: 'USA-Estate' })).toBeInTheDocument();
  expect(within(log).getAllByRole('article')).toHaveLength(7);
  expect(within(log).queryByRole('link', { name: '#' })).not.toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Tech stack' }));
  expect(within(log).getByText('Backend & data')).toBeInTheDocument();
  expect(within(log).getByRole('heading', { name: 'USA-Estate' })).toBeInTheDocument();
});

test('handles typed questions, unknown questions, and reset', () => {
  render(<Conversation />);
  const input = screen.getByRole('textbox');
  expect(screen.getByRole('button', { name: 'Send question' })).toBeDisabled();
  fireEvent.change(input, { target: { value: 'What technologies do you use?' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(screen.getByText('Backend & data')).toBeInTheDocument();
  expect(input).toHaveValue('');
  fireEvent.change(input, { target: { value: 'What is the weather?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send question' }));
  expect(screen.getByRole('heading', { name: 'Let’s stay with what I know.' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
  expect(screen.queryByRole('log')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(input).toHaveFocus();
});

test('preserves multiline input and composition without submitting', () => {
  render(<Conversation />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'projects' } });
  fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
  expect(screen.queryByRole('log')).not.toBeInTheDocument();
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(screen.queryByRole('log')).not.toBeInTheDocument();
});

test('exposes real contact and downloadable resume links', () => {
  render(<Conversation />);
  const navigation = screen.getByRole('navigation');
  fireEvent.click(within(navigation).getByRole('button', { name: 'Résumé' }));
  expect(screen.getByRole('link', { name: /Usama Hassan Résumé/ })).toHaveAttribute('download', 'Usama-Hassan-Resume.pdf');
  fireEvent.click(within(navigation).getByRole('button', { name: 'Get in touch' }));
  expect(screen.getByRole('link', { name: 'usama.0.vip@gmail.com' })).toHaveAttribute('href', 'mailto:usama.0.vip@gmail.com');
});

test('toggles theme and closes mobile navigation with Escape', () => {
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(localStorage.getItem('portfolio-theme')).toBe('dark');
  const toggle = screen.getByRole('button', { name: 'Toggle navigation' });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(toggle, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

test('lets visitors skip a response reveal and immediately use its links', () => {
  setReducedMotion(false);
  render(<Conversation />);
  fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Get in touch' }));
  expect(screen.getByText('Preparing reply')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Show full response/ }));
  expect(screen.queryByText('Preparing reply')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'usama.0.vip@gmail.com' })).toBeVisible();
  expect(screen.getByRole('textbox')).toHaveFocus();
});

test('a new question completes the previous reply and reset cancels pending motion', () => {
  setReducedMotion(false);
  render(<React.StrictMode><Conversation /></React.StrictMode>);
  const navigation = screen.getByRole('navigation');
  fireEvent.click(within(navigation).getByRole('button', { name: 'Get in touch' }));
  fireEvent.click(within(navigation).getByRole('button', { name: 'Tech stack' }));
  expect(screen.getByRole('link', { name: 'usama.0.vip@gmail.com' })).toBeVisible();
  expect(screen.getAllByRole('button', { name: /Show full response/ })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
  expect(screen.queryByRole('log')).not.toBeInTheDocument();
  expect(screen.queryByText('Preparing reply')).not.toBeInTheDocument();
});

test('reduced motion shows complete responses without a typing delay', () => {
  render(<Conversation />);
  fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Get in touch' }));
  expect(screen.queryByRole('button', { name: /Show full response/ })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'usama.0.vip@gmail.com' })).toBeVisible();
});

test('walks through the four tour stops and returns to the conversation', () => {
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: /Take a quick tour/ }));
  const tour = screen.getByRole('region', { name: 'Guided tour' });
  expect(within(tour).getByText('Meet Usama')).toBeInTheDocument();
  expect(within(tour).getByRole('button', { name: 'Next' })).toHaveFocus();
  fireEvent.click(within(tour).getByRole('button', { name: 'Next' }));
  expect(within(tour).getByText('Selected projects')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(3);
  fireEvent.click(within(tour).getByRole('button', { name: 'Next' }));
  expect(screen.getByText('Bellmedex Pakistan')).toBeInTheDocument();
  fireEvent.click(within(tour).getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('link', { name: 'usama.0.vip@gmail.com' })).toBeInTheDocument();
  fireEvent.click(within(tour).getByRole('button', { name: 'Finish tour' }));
  expect(screen.queryByRole('region', { name: 'Guided tour' })).not.toBeInTheDocument();
  expect(screen.getByRole('textbox')).toHaveFocus();
  expect(screen.getByRole('log')).toBeInTheDocument();
});

test('starts a tour from a typed prompt and lets visitors skip or choose another topic', () => {
  render(<Conversation />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Give me a quick tour' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  fireEvent.click(screen.getByRole('button', { name: 'Skip tour' }));
  expect(screen.queryByRole('region', { name: 'Guided tour' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Quick tour' }));
  fireEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Tech stack' }));
  expect(screen.queryByRole('region', { name: 'Guided tour' })).not.toBeInTheDocument();
  expect(screen.getByText('Backend & data')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Quick tour' }));
  fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
  expect(screen.queryByRole('region', { name: 'Guided tour' })).not.toBeInTheDocument();
});

test('case studies expand independently and a failed screenshot gets an honest fallback', () => {
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: /Show me Usama’s projects/ }));
  const firstProject = screen.getAllByRole('article')[0];
  const summary = within(firstProject).getByText('Read case study');
  fireEvent.click(summary);
  expect(within(firstProject).getByText('Technical decisions')).toBeVisible();
  fireEvent.click(summary);
  expect(within(firstProject).getByText('Technical decisions')).not.toBeVisible();
  fireEvent.error(within(firstProject).getByRole('img'));
  expect(within(firstProject).getByText('Project overview')).toBeVisible();
  expect(within(firstProject).queryByRole('button', { name: 'Preview USA-Estate' })).not.toBeInTheDocument();
});

test('opens and closes a screenshot preview, returning focus to its trigger', () => {
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: /Show me Usama’s projects/ }));
  const trigger = screen.getByRole('button', { name: 'Preview USA-Estate' });
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'USA-Estate' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Close project preview' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
});
