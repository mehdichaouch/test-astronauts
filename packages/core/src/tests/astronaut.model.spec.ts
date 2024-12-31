import { describe, expect, it } from 'vitest';
import { AstronautUpdates, Firstname, Lastname, NewAstronaut } from '../astronaut.model';
import { AstronautInvalidValue } from '../astronaut.error';

describe('Firstname', () => {
    it('should create instance with valid value', () => {
        const firstname = Firstname.from('Neil');
        expect(firstname).toBeInstanceOf(Firstname);
        expect(firstname.value).toBe('Neil');
    });

    it('should return error for empty string', () => {
        const firstname = Firstname.from('');
        expect(firstname).toBeInstanceOf(Error);
        expect(firstname.message).toBe('Firstname must be a non-empty string');
    });

    it('should return error for non-string value', () => {
        const firstname = Firstname.from(123);
        expect(firstname).toBeInstanceOf(Error);
        expect(firstname.message).toBe('Firstname must be a non-empty string');
    });

    it('should return error for null value', () => {
        const firstname = Firstname.from(null);
        expect(firstname).toBeInstanceOf(Error);
        expect(firstname.message).toBe('Firstname must be a non-empty string');
    });
});

describe('Lastname', () => {
    it('should create instance with valid value', () => {
        const lastname = Lastname.from('Armstrong');
        expect(lastname).toBeInstanceOf(Lastname);
        expect(lastname.value).toBe('Armstrong');
    });

    it('should return error for empty string', () => {
        const lastname = Lastname.from('');
        expect(lastname).toBeInstanceOf(AstronautInvalidValue);
        expect(lastname.message).toBe('Lastname must be a non-empty string');
    });

    it('should return error for non-string value', () => {
        const lastname = Lastname.from(123);
        expect(lastname).toBeInstanceOf(AstronautInvalidValue);
        expect(lastname.message).toBe('Lastname must be a non-empty string');
    });

    it('should return error for null value', () => {
        const lastname = Lastname.from(null);
        expect(lastname).toBeInstanceOf(AstronautInvalidValue);
        expect(lastname.message).toBe('Lastname must be a non-empty string');
    });
});

describe('NewAstronaut', () => {
    it('should create instance with valid data', () => {
        const astronaut = NewAstronaut.from({ 
            firstname: 'Neil', 
            lastname: 'Armstrong' 
        });
        
        expect(astronaut).toBeInstanceOf(NewAstronaut);
        expect(astronaut.value.firstname.value).toBe('Neil');
        expect(astronaut.value.lastname.value).toBe('Armstrong');
    });

    it('should return error when firstname is missing', () => {
        const astronaut = NewAstronaut.from({ lastname: 'Armstrong' });
        expect(astronaut).toBeInstanceOf(AstronautInvalidValue);
        expect(astronaut.errors[0].message).toBe("'firstname' is required");
    });

    it('should return error when lastname is missing', () => {
        const astronaut = NewAstronaut.from({ firstname: 'Neil' });
        expect(astronaut).toBeInstanceOf(AstronautInvalidValue);
        expect(astronaut.errors[0].message).toBe("'lastname' is required");
    });

    it('should return errors when both values are invalid', () => {
        const astronaut = NewAstronaut.from({ firstname: '', lastname: null });
        expect(astronaut).toBeInstanceOf(AstronautInvalidValue);
        expect(astronaut.errors[0].message).toBe('Firstname must be a non-empty string');
        expect(astronaut.errors[1].message).toContain('Lastname must be a non-empty string');
    });
});

describe('AstronautUpdates', () => {
    it('should create instance with firstname update', () => {
        const update = AstronautUpdates.from({ 
            id: "1", 
            firstname: 'Neil' 
        });

        expect(update).toBeInstanceOf(AstronautUpdates);
        expect(update.value.firstname?.value).toBe('Neil');
    });

    it('should create instance with lastname update', () => {
        const update = AstronautUpdates.from({ 
            id: "1", 
            lastname: 'Armstrong' 
        });

        expect(update).toBeInstanceOf(AstronautUpdates);
        expect(update.value.lastname?.value).toBe('Armstrong');
    });

    it('should create instance with both firstname and lastname update', () => {
        const update = AstronautUpdates.from({ 
            id: "1", 
            firstname: 'Neil',
            lastname: 'Armstrong' 
        });

        expect(update).toBeInstanceOf(AstronautUpdates);
        expect(update.value.firstname?.value).toBe('Neil');
        expect(update.value.lastname?.value).toBe('Armstrong');
    });

    it('should return error for invalid id', () => {
        const update = AstronautUpdates.from({ 
            id: '', 
            firstname: 'Neil' 
        });

        expect(update).toBeInstanceOf(AstronautInvalidValue);
        expect(update.errors[0].message).toBe('Astronaut id must be a non-empty string');
    });

    it('should return error when no update properties provided', () => {
        const update = AstronautUpdates.from({ id: '1' });
        expect(update).toBeInstanceOf(AstronautInvalidValue);
        expect(update.errors[0].message).toBe("At least one property 'firstname' or 'lastname' must be provided for update.");
    });

    it('should return error for invalid firstname', () => {
        const update = AstronautUpdates.from({ 
            id: '1', 
            firstname: '', 
            lastname: 'Armstrong' 
        });

        expect(update).toBeInstanceOf(AstronautInvalidValue);
        expect(update.errors[0].message).toBe('Firstname must be a non-empty string');
    });
});
