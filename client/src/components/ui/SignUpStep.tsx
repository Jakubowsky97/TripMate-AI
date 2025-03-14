import { CiCircleCheck } from "react-icons/ci";

interface SignUpStepInterface {
  step: number;
  text: string;
  active?: boolean;
  description: string;
}

export default function SignUpStep({ step, text, active, description }: SignUpStepInterface) {
  return (
    <li
      className={`flex items-center ${
        active ? "text-[#142F32] font-semibold" : "text-[#777C90]"
      }`}
    >
      <CiCircleCheck
        className={`size-6 ${active ? "text-[#142F32]" : "text-[#C6D7C6]"}`}
      />
      <div className="flex flex-col ml-3">
         <span className="">{text}</span>
        <p className="font-normal">{description}</p>
      </div>
    </li>
  );
}
