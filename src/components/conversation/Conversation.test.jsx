import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Conversation from './Conversation';
import { matchTopic, topics } from './content';

beforeEach(() => localStorage.clear());

test.each(topics)('recognizes the prepared $id prompt', topic => {
  expect(matchTopic(topic.prompt)).toBe(topic.id);
});

test('reveals real projects and keeps the conversation when another topic is selected', () => {
  render(<Conversation />);
  fireEvent.click(screen.getByRole('button', { name: /Show me Usama’s projects/ }));
  const log = screen.getByRole('log');
  expect(within(log).getByRole('heading', { name: 'USA-Estate' })).toBeInTheDocument();
  expect(within(log).getAllByRole('article')).toHaveLength(7);
  expect(log.querySelector('a[href="#"]')).toBeNull();
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
  expect(screen.getByText('Let’s stay with what I know.')).toBeInTheDocument();
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
