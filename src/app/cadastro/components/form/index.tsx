"use client"
import Input from "@/components/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

interface IUser {
  email: string;
  password: string;
  username: string;
}

export default function Form() {
  const [data, setData] = useState<IUser>({
    email: "",
    password: "",
    username: "",
  });

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const request = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (!request.ok) {
      console.log("Erro no Cadastro: Tente novamente.");
    } else {
      router.push("/login");
    }

    setData({
      email: "",
      password: "",
      username: "",
    });
    setIsLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div>
        <Input
          id="email"
          placeholder="E-mail"
          type="email"
          disabled={isLoading}
          name="email"
          value={data.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Input
          id="username"
          placeholder="Username"
          type="text"
          disabled={isLoading}
          name="username"
          value={data.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <Input
          id="password"
          placeholder="Senha"
          type="password"
          disabled={isLoading}
          name="password"
          value={data.password}
          onChange={handleChange}
        />
      </div>
      {/* Botão de subimit do form */}
      <div className="flex justify-center">
        <button disabled={isLoading} className="flex items-center gap-4 py-2 px-8 rounded cursor-pointer hover:bg-colorMintGreen hover:text-deepcharcoal transition-colors text-black font-bold bg-colorSkyBlue w-fit">
          {isLoading ? (<> <FaSpinner /> Realizando cadastro </>) : ("Realizar cadastro")} </button>
      </div>
    </form>
  )
}