"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

const PokemonDetail = () => {
  const params = useParams();
  const id = params?.id; 
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; 

    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Failed to fetch Pokemon");
        
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) return <Loader />;
  if (!pokemon) return <p className="text-center mt-10 text-gray-500">😓 Pokemon not found!</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-5xl font-extrabold capitalize text-gray-800">{pokemon.name}</h1>

        <div className="mt-6 flex justify-center">
          <img
            src={pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default || "/placeholder.png"}
            alt={pokemon.name}
            className="w-52 h-52 object-contain drop-shadow-xl transition-transform transform hover:scale-105"
          />
        </div>

        <div className="mt-6">
          <span className="text-gray-700 font-semibold text-xl">Type:</span>
          <div className="mt-2 flex justify-center gap-3">
            {pokemon.types?.map((t: any, index: number) => (
              <span key={index} className="bg-yellow-400 text-gray-900 text-sm px-4 py-1 rounded-full capitalize shadow-md">
                {t.type.name}
              </span>
            )) || <span className="text-gray-500">No type available</span>}
          </div>
        </div>

        <div className="mt-6">
          <span className="text-gray-700 font-semibold text-xl">Abilities:</span>
          <p className="mt-2 text-gray-800 text-lg capitalize font-medium">
            {pokemon.abilities?.map((a: any) => a.ability.name).join(", ") || "No abilities found"}
          </p>
        </div>

        <div className="mt-6">
          <span className="text-gray-700 font-semibold text-xl">Base Experience:</span>
          <p className="mt-2 text-gray-800 text-lg font-bold">{pokemon.base_experience || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
