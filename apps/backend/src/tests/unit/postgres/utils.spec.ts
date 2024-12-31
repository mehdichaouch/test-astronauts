import { Astronaut, AstronautUpdates, Firstname, Lastname } from '@space/core/astronaut.model.js'
import { describe, it, expect, vi } from 'vitest'
import { cleaningListResult, prepareUpdateAstronautSql } from '../../../postgres/utils.ts'
import { afterEach } from 'node:test'

describe("Postgres utils", () => {
    describe('cleaningListResult', () => {
  
        afterEach(() => {
            vi.clearAllMocks();
        })

        it('should return empty array when input is empty', () => {
            expect(cleaningListResult([])).toEqual([])
        })

        it('should filter errors and keep valid astronauts', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            const astronaut: Astronaut = new Astronaut('1', Firstname.from('Neil') as Firstname, Lastname.from('Armstrong') as Lastname)
            const error = new Error('Test error')

            const result = cleaningListResult([astronaut, error])

            expect(result).toEqual([astronaut]);
            expect(consoleSpy).toHaveBeenCalled();
        })

        it('should handle array with only errors', () => {
            const errors = [new Error('1'), new Error('2')]

            const result = cleaningListResult(errors)

            expect(result).toEqual([])
        })

        it('should handle array with only astronauts', () => {
            const astronauts: Astronaut[] = [
                new Astronaut('1', Firstname.from('Neil') as Firstname, Lastname.from('Armstrong') as Lastname),
                new Astronaut('1', Firstname.from('Buzz') as Firstname, Lastname.from('Aldrin') as Lastname)
            ]

            const result = cleaningListResult(astronauts)

            expect(result).toEqual(astronauts)
        })
    })

    describe('prepareUpdateAstronautSql', () => {
        it('should handle multiple fields to update', () => {
            const updates = AstronautUpdates.from({id: '1', firstname: 'Neil', lastname: 'Armstrong'});

            const [sql, values] = prepareUpdateAstronautSql(updates as AstronautUpdates)

            expect(sql).toBe('firstname=$2,lastname=$3')
            expect(values).toEqual(['1', 'Neil', 'Armstrong'])
        })
    })

})