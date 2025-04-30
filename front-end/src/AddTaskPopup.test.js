import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTaskPopup from './AddTaskPopup';

describe('AddTaskPopup', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  test('alerts on missing fields', () => {
    render(<AddTaskPopup />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
  });

  test('validates date format', () => {
    render(<AddTaskPopup />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/task:/i), {
      target: { value: 'Task1' },
    });
    fireEvent.change(screen.getByLabelText(/deadline:/i), {
      target: { value: 'not-a-date' },
    });
    fireEvent.click(screen.getByRole('button', { name: /to-do/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalledWith(
      'Please enter a valid date in YYYY-MM-DD format.'
    );
  });

  test('posts correct payload and navigates on save', async () => {
    const mockNav = jest.fn();
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNav);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<AddTaskPopup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/task:/i), {
      target: { value: 'Task1' },
    });
    fireEvent.change(screen.getByLabelText(/deadline:/i), {
      target: { value: '2025-06-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /to-do/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks'),
      expect.objectContaining({ method: 'POST', body: expect.any(String) })
    );
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({ title: 'Task1', status: 'todo' });
    expect(new Date(body.deadline).toString()).not.toBe('Invalid Date');
    expect(mockNav).toHaveBeenCalledWith('/todo');
  });
});