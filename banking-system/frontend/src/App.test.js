import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the dashboard link', () => {
  render(<App />);
  const dashboardElement = screen.getByText(/dashboard/i);
  expect(dashboardElement).toBeInTheDocument();
});
