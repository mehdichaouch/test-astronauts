import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { AstronautForm } from '../../components/AstronautForm';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { Astronaut, AstronautUpdates, Firstname, Lastname } from '@space/core/astronaut.model.js';

describe('AstronautForm', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    describe('Add Mode', () => {
        it('renders the form with empty fields', () => {
            render(<AstronautForm mode="add" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const firstNameInput = screen.getByLabelText('First Name');
            const lastNameInput = screen.getByLabelText('Last Name');

            expect(firstNameInput).toBeInTheDocument();
            expect(firstNameInput).toHaveValue('');
            expect(lastNameInput).toBeInTheDocument();
            expect(lastNameInput).toHaveValue('');
        });

        it('allows input in the firstname and lastname fields', () => {
            render(<AstronautForm mode="add" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const firstNameInput = screen.getByLabelText('First Name');
            const lastNameInput = screen.getByLabelText('Last Name');

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

            expect(firstNameInput).toHaveValue('John');
            expect(lastNameInput).toHaveValue('Doe');
        });

        it('calls onSubmit with valid data', () => {
            render(<AstronautForm mode="add" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const firstNameInput = screen.getByLabelText('First Name');
            const lastNameInput = screen.getByLabelText('Last Name');
            const submitButton = screen.getByText('Add');

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.click(submitButton);

            expect(mockOnSubmit).toHaveBeenCalled();
        });

        it('does not call onSubmit with invalid data', () => {
            render(<AstronautForm mode="add" onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const submitButton = screen.getByText('Add');
            fireEvent.click(submitButton);

            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    });

    describe('Edit Mode', () => {
        const firstname = Firstname.from("Neil") as Firstname;
        const lastname = Lastname.from("Armstrong") as Lastname;
        const astronaut: Astronaut = new Astronaut("1", firstname, lastname);


        it('renders the form with pre-filled values', () => {
            render(<AstronautForm mode="edit" value={astronaut} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const firstNameInput = screen.getByLabelText('First Name');
            const lastNameInput = screen.getByLabelText('Last Name');

            expect(firstNameInput).toHaveValue('Neil');
            expect(lastNameInput).toHaveValue('Armstrong');
        });

        it('calls onSubmit with updated data', () => {
            render(<AstronautForm mode="edit" value={astronaut} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const firstNameInput = screen.getByLabelText('First Name');
            const submitButton = screen.getByText('Edit');

            fireEvent.change(firstNameInput, { target: { value: 'lieN' } });
            fireEvent.click(submitButton);
;
            const expected = AstronautUpdates.from({id: astronaut.id, firstname: 'lieN'})
            expect(mockOnSubmit).toHaveBeenCalledWith(expected);
        });

        it('calls onCancel when cancel button is clicked', () => {
            render(<AstronautForm mode="edit" value={astronaut} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalled();
        });
    });
});