import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import BackButton from './back-button'
import { Header } from './header'

interface CardWrapperProps{
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel?: string,
    backButtonHref?: string,
    secondaryHeading:string
}


const CardWrapper = ({children,headerLabel,backButtonHref,backButtonLabel,secondaryHeading}: CardWrapperProps) => {
  return (
    <Card className="w-full shadow-md ">
        <CardHeader><Header label={headerLabel} secondaryHeading={secondaryHeading} /></CardHeader>
        <CardContent>
            {children}
        </CardContent>
        <CardFooter>
            <BackButton href={backButtonHref} label={backButtonLabel}/>
        </CardFooter>
    </Card>
  )
}

export default CardWrapper