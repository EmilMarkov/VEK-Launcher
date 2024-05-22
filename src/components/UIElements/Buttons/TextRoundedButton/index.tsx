import React from 'react'
import { Button, Props } from './styles'

const TextRoundedButton: React.FC<Props> = ({
    id,
    ref,
    type,
    onClick,
    isActive,
    text,
    highlightIcon,
    width,
    height,
    colorDefault,
    colorHover,
    colorPressed,
    colorActive,
    radius,
    title
})=>{

    return(
        <Button
            id={id}
            ref={ref}
            type={type}
            onClick={onClick}
            isActive={isActive}
            width={width}
            height={height}
            colorDefault={colorDefault}
            colorHover={colorHover}
            colorPressed={colorPressed}
            colorActive={colorActive}
            radius={radius}
            title={title}
            highlightIcon={highlightIcon}
        >
            {text}
        </Button>
    )
}

export default TextRoundedButton