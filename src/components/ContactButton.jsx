import { useContact } from "../context/ContactContext";

const doubleArrowIcon = "/keyboard_double_arrow_right.svg";

export default function ContactButton({ className = "", onBeforeOpen }) {
  const { openContact } = useContact();

  const handleClick = () => {
    onBeforeOpen?.();
    openContact();
  };

  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={handleClick}
      className={`group inline-flex items-center bg-accent px-4 py-3 font-geist-mono text-sm text-accent-ivory uppercase transition-colors duration-300 hover:bg-[#f26a27] ${className}`}
    >
      Contact me
      <span className="ml-0 max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-1 group-hover:max-w-4 group-hover:opacity-100">
        <img src={doubleArrowIcon} alt="" className="size-4" />
      </span>
    </button>
  );
}
