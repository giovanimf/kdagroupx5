import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="md:max-w-screen-xl w-full mx-auto p-4 md:p-5 flex flex-col gap-4 h-fit justify-center text-center">
      {children}
    </div>
  );
}
