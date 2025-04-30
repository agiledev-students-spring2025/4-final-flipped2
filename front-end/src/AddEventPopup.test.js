import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddEventPopup from './AddEventPopup';

describe('AddEventPopup', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  test('alerts if fields are empty', () => {
    render(<AddEventPopup />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
  });

  test('submits valid form and navigates', async () => {
    const mockNav = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNav);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<AddEventPopup />, { wrapper: MemoryRouter });

    // match label "Event:" exactly
    fireEvent.change(screen.getByLabelText(/event:/i), {
      target: { value: 'My Event' },
    });
    fireEvent.change(screen.getByLabelText(/date:/i), {
      target: { value: '2025-05-01' },
    });
    fireEvent.change(screen.getByLabelText(/time:/i), {
      target: { value: '12:34' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/events'),
      expect.objectContaining({ method: 'POST', body: expect.any(String) })
    );
    expect(mockNav).toHaveBeenCalledWith('/calendar');
  });
});