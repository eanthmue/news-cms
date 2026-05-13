import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SampleButton } from '@/components/ui/SampleButton';

describe('SampleButton', () => {
  it('should render children correctly', () => {
    render(<SampleButton>Click Me</SampleButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<SampleButton onClick={handleClick}>Click Me</SampleButton>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct classes', () => {
    render(<SampleButton>Click Me</SampleButton>);
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('bg-blue-500');
  });
});
