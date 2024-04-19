'use client'

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props{
    children: ReactNode;
}
export default function Providers(props: Props){

    return(
        <SessionProvider>{props.children}</SessionProvider>
    )

}