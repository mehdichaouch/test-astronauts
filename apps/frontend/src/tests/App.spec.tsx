import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { Astronaut, AstronautUpdates, Firstname, Lastname, NewAstronaut } from '@space/core/astronaut.model.ts';
import { AstronautFeaturesProvider } from '../hooks/useAstronautFeatures';
import App from '../App';
import { ReactNode } from 'react';


describe('App Component', () => {
    const astronaut1 = new Astronaut('1', Firstname.from('Neil') as Firstname, Lastname.from('Armstrong') as Lastname);
    const astronaut2 = new Astronaut('2', Firstname.from('Buzz') as Firstname, Lastname.from('Aldrin') as Lastname);

    let astronautFeatures: {
        listAstronauts: Mock;
        addAstronaut: Mock;
        updateAstronaut: Mock;
        deleteAstronaut: Mock;
    };
    let template: ReactNode;

    beforeEach(() => {
        astronautFeatures = {
            listAstronauts: vi.fn(() => Promise.resolve([])),
            addAstronaut: vi.fn(() => Promise.resolve()),
            updateAstronaut: vi.fn(() => Promise.resolve()),
            deleteAstronaut: vi.fn(() => Promise.resolve()),
        };

        template = (
            <AstronautFeaturesProvider value={astronautFeatures}>
                <App />
            </AstronautFeaturesProvider>
        )
    });

    it('renders the table header and the add button', () => {
        render(template);
        expect(screen.getByText('Astronauts')).toBeInTheDocument();
        expect(screen.getByText('Add Astronaut')).toBeInTheDocument();
    });

    it('fetches and displays astronauts', async () => {
        const astronauts: Astronaut[] = [astronaut1, astronaut2];
        astronautFeatures.listAstronauts.mockResolvedValueOnce(astronauts);

        render(template);

        await waitFor(() => {
            expect(screen.getByText('Neil')).toBeInTheDocument();
            expect(screen.getByText('Buzz')).toBeInTheDocument();
        });
    });

    it('opens the add astronaut form', async () => {
        render(template);

        fireEvent.click(screen.getByRole('button', { name: 'Add Astronaut' }));

        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    });

    it('submits a new astronaut and refreshes the list', async () => {
        const newAstronaut = NewAstronaut.from({ firstname: 'Michael' , lastname: 'Collins' }) as NewAstronaut;

        render(template);
        fireEvent.click(screen.getByRole('button', { name: 'Add Astronaut' }));

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Michael' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Collins' } });
        fireEvent.click(screen.getByText('Add'));

        await waitFor(() => {
            expect(astronautFeatures.addAstronaut).toHaveBeenCalledWith(expect.objectContaining(newAstronaut));
            expect(astronautFeatures.listAstronauts).toHaveBeenCalledTimes(2);
        });
    });

    it('opens the edit astronaut form with pre-filled values', async () => {
        astronautFeatures.listAstronauts.mockResolvedValueOnce([astronaut1]);

        render(template);
        await waitFor(() => {
            expect(screen.getByText('Neil')).toBeInTheDocument();
        });

        const editButton = within(screen.getByText('Neil').closest('tr')!).getByRole('button', {name: 'Edit'})
        fireEvent.click(editButton);

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('Neil');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Armstrong');
    });

    it('submits an astronaut update and refreshes the list', async () => {
        astronautFeatures.listAstronauts.mockResolvedValueOnce([astronaut1]);
        const updates = AstronautUpdates.from({id: astronaut1.id, firstname: 'lieN'})as AstronautUpdates;

        render(template);
        await waitFor(() => {
            expect(screen.getByText('Neil')).toBeInTheDocument();
        });

        const editButton = within(screen.getByText('Neil').closest('tr')!).getByRole('button', {name: 'Edit'})
        fireEvent.click(editButton);

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: updates.value.firstname!.value } });
        
        const submitButton = within(screen.getByLabelText(/First Name/i).closest('form')!).getByRole('button', {name: 'Edit'})
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(astronautFeatures.updateAstronaut).toHaveBeenCalledWith(updates);
            expect(astronautFeatures.listAstronauts).toHaveBeenCalledTimes(2);
        });
    });

    it('deletes an astronaut and refreshes the list', async () => {
        astronautFeatures.listAstronauts.mockResolvedValueOnce([astronaut1]);

        render(template);
        await waitFor(() => {
            expect(screen.getByText('Neil')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(astronautFeatures.deleteAstronaut).toHaveBeenCalledWith('1');
            expect(astronautFeatures.listAstronauts).toHaveBeenCalledTimes(2);
        });
    });

    it('handles form cancellation correctly', async () => {
        render(template);
        fireEvent.click(screen.getByText('Add Astronaut'));

        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
});
