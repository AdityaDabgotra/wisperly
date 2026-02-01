'use client';
import { useSession,signIn,signOut } from "next-auth/react";

export default function page(){
  const { data: session } = useSession();
  if(session){
    return (
      <>
        Signed in as {session.user?.email} <br/>
        <button className="bg-orange-500 px-3 py-1 rounded m-2" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br/>
      <button className="bg-orange-500 px-3 py-1 rounded m-2" onClick={() => signIn()}>Sign in</button>
    </>
  );
}