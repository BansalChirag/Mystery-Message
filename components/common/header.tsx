import { Poppins } from "next/font/google";

const font = Poppins({
    subsets:["latin"],
    weight:["600"],
})

interface HeaderProps{
    label:string,
    secondaryHeading: string
}

export const Header=({label,secondaryHeading}:HeaderProps)=>{
    return (
        <div className="w-full text-center flex-col flex gap-y-4 item-center justify-center">
            {/* <h1 className={cn("text-4xl font-semibold")}> */}
            {/* <div className="flex justify-center items-center ">👻</div> */}
            {/* </h1> */}
            <p className="text-muted-foreground text-2xl font-semibold">
                {label}
            </p>
            <p className="text-gray-600" style={{marginTop:"-10px"}}>
            {secondaryHeading}
            </p>
        </div>
    )
}