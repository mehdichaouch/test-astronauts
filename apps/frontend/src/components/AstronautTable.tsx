import { Astronaut } from "@space/core/astronaut.model.ts";
import style from './AstronautTable.module.css';

interface AstronautTableProps {
    astronauts: readonly Astronaut[];
    actions?(astronaut: Astronaut): readonly (JSX.Element)[];
}

export function AstronautTable({ astronauts, actions }: AstronautTableProps): JSX.Element {
    return (
        <table className={style['table']}>
            <thead>
                <tr><th>ID</th><th>firstname</th><th>lastname</th><th></th></tr>
            </thead>
            <tbody>
                {astronauts?.map((astronaut) => (
                    <tr key={astronaut.id}>
                        <td>{astronaut.id}</td>
                        <td>{astronaut.firstname.value}</td>
                        <td>{astronaut.lastname.value}</td>
                        <td>
                            {actions?.(astronaut)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}