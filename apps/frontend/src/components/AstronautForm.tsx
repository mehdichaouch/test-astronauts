import { Astronaut, AstronautUpdates, Firstname, Lastname, NewAstronaut } from "@space/core/astronaut.model.ts";
import { FormEvent, useState } from "react";
import { Field } from "./Field";
import style from './AstronautForm.module.css';

interface AstronautAddFormProps {
    mode: 'add';
    onSubmit(value: NewAstronaut): void;
    onCancel(): void;
}

interface AstronautEditFormProps {
    mode: 'edit',
    value: Astronaut,
    onSubmit(value: AstronautUpdates): void;
    onCancel(): void
}

function validateInput(validator: (value: unknown) => Error | unknown) {
    return (input: HTMLInputElement, value: unknown) => {
        const result = validator(value);
        if (result instanceof Error) {
            input.setCustomValidity(result.message);
        }
    }
}

function getInitialFieldValue(stateValue: string, propsValue: string | undefined): string {
    return '' !== stateValue ? stateValue : propsValue ?? '';
}

function replaceEmptyStringByUndefined(value: string): string | undefined {
    return 0 === value.length ? undefined : value;
}

export function AstronautForm(props: AstronautAddFormProps | AstronautEditFormProps): JSX.Element {
    const { mode, onCancel, onSubmit } = props;
    const value = 'value' in props ? props.value : undefined;

    const isEditMode = 'edit' === mode;
    const isFieldReduired = !isEditMode;
    const formTitle = isEditMode ? "Edit Astronaut" : "Add Astronaut";
    const submitLabel = isEditMode ? "Edit" : "Add"

    const defaultFirstname = value?.firstname;
    const defaultLastname = value?.lastname;

    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!event.currentTarget.checkValidity()) {
            return;
        }

        const commonData = {
            firstname: replaceEmptyStringByUndefined(firstname),
            lastname: replaceEmptyStringByUndefined(lastname)
        }
        const astronaut = isEditMode
            ? AstronautUpdates.from({ ...commonData, id: value!.id })
            : NewAstronaut.from(commonData);

        if(astronaut instanceof Error) {
            console.error(astronaut.message)
            return;
        }
        
        // @ts-expect-error: TypeScript cannot correctly infer the type
        onSubmit(astronaut as unknown as NewAstronaut);
    }

    const validateFirstname = validateInput(Firstname.from);
    const validateLastname = validateInput(Lastname.from);


    return (
        <form onSubmit={handleSubmit} className={style['form']}>
            <h2>{formTitle}</h2>

            <Field
                id="firstname"
                label={"First Name"}
                name="firstname"
                onChange={(e) => setFirstname(e.target.value)}
                required={isFieldReduired}
                type="text"
                validate={validateFirstname}
                value={getInitialFieldValue(firstname, defaultFirstname?.value)}
            />

            <Field
                id="lastname"
                label={"Last Name"}
                name="lastname"
                onChange={(e) => setLastname(e.target.value)}
                required={isFieldReduired}
                type="text"
                validate={validateLastname}
                value={getInitialFieldValue(lastname, defaultLastname?.value)}
            />

            <div className="actions">
                <button type='submit'>{submitLabel}</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}