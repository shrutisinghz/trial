import NextAuth from "next-auth"
 
const config = {
    provider : [],

}

export const {handlers, signIn, signOut, auth} = NextAuth(config);