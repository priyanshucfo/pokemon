import Link from "next/link";

const Card = ({ name, index }: { name: string; index: number }) => {
  return (
    <Link href={`/pokemon/${index}`}>
      <div className="border p-5 rounded-lg bg-white shadow-md transform hover:scale-105 transition-all cursor-pointer">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`}
          alt={name}
          className="mx-auto w-24 h-24"
        />
        <p className="mt-3 text-lg font-semibold capitalize">{name}</p>
      </div>
    </Link>
  );
};

export default Card;
