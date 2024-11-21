interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input: React.FC<InputProps> = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="w-full px-4 py-2 border rounded focus:outline-none bg-gray-800"
      {...props}
    />
  );
};

export default Input;
