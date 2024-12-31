import { InputHTMLAttributes, useRef } from "react";
import style from './Field.module.css';

type PickedInputAttributes =  Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'name' | 'required' | 'disabled' | 'onChange' | 'value'>
interface FieldProps extends PickedInputAttributes{
    label: string;
    validate?(input: HTMLInputElement, value: Required<PickedInputAttributes['value']>): void
}

export function Field(props: FieldProps): JSX.Element {
    const inputRef = useRef<HTMLInputElement>(null);
    const {onChange, validate } = props;

    const handleOnChange: FieldProps['onChange'] = (event) => {
        if(null !== inputRef.current) {
            validate?.(inputRef.current, event.target.value);
        }
        onChange?.(event);
    }

    return (
        <div className={style["field"]}>
        <label htmlFor={props["id"]}>{props.label}</label>
        <input
            id={props["id"]}
            name={props["name"]}
            onChange={handleOnChange}
            ref={inputRef}
            required={props.required}
            type={props["type"]}
            value={props["value"]}
        />
        </div>
    )
}