import { FC } from "react";
import style from './RainbowText.module.css';

interface Props {
    text?: string
}

const RainbowText: FC<Props> = ({ text, ...props }) => {

    return (
        <>
            {text && text.length > 0 && <span {...props} className={style.rainbow} >{text}</span>}
        </>
    )
}

export default RainbowText;