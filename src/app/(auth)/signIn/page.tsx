'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z  from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUp";
import axios, {AxiosError} from "axios";

const page = () => {
  const [username,setUsername] = useState();
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
  const router = useRouter();
  const debouncedUsername = useDebounceValue(username,300)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
    });

    useEffect(() => {
      const checkUsernameUnique = async () => {
        if(debouncedUsername){
          setIsCheckingUsername(true);
          setUsernameMessage('');
          try {
            const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
            if(response.data.success){
              setUsernameMessage('Username is available');
            }
          } catch (error) {
            
          }
        }
      }
    },[debouncedUsername])

  return (
    <div>
      
    </div>
  )
}

export default page
