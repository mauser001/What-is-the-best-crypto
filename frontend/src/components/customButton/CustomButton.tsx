import { FC } from "react";
import style from './CustomButton.module.css';

interface Props {
    enabled: boolean,
    label: string,
    onClick: () => void,
}

const CustomButton: FC<Props> = ({ enabled, label, onClick, ...props }) => {

    const buttonStyles = enabled ? style.default : [style.default, style.disabled].join(' ');
    return (<div {...props} className={buttonStyles} onClick={() => enabled && onClick()}>{label}</div>)
}

export default CustomButton;